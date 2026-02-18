from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal
from urllib.parse import parse_qs
import uuid
from typing import Dict, Union
import calendar
from functools import partial
from chatbot import models

def get_date_range_wrapper(user_id, month: int, year: int) -> dict:
    """Returns the Unix timestamp range for a given month and year."""
    import calendar
    from datetime import datetime, timezone
    start = datetime(year, month, 1, tzinfo=timezone.utc)
    last_day = calendar.monthrange(year, month)[1]
    end = datetime(year, month, last_day, 23, 59, 59, tzinfo=timezone.utc)
    return {
        "start_timestamp": int(start.timestamp()),
        "end_timestamp": int(end.timestamp()),
        "description": f"{start.strftime('%B %Y')}"
    }

def _to_int_ts(x: Union[int, str]) -> int:
    if isinstance(x, int):
        return x
    if isinstance(x, str) and x.strip().isdigit():
        return int(x.strip())
    raise ValueError(f"Expected unix timestamp int, got {x!r}")

def _ts_to_dt(ts: int) -> datetime:
    return datetime.fromtimestamp(ts, tz=timezone.utc)

def _month_key(dt: datetime) -> str:
    return f"{dt.year:04d}-{dt.month:02d}"

def _next_month(dt: datetime) -> datetime:
    if dt.month == 12:
        return dt.replace(year=dt.year + 1, month=1, day=1)
    return dt.replace(month=dt.month + 1, day=1)



def get_spend_summary_wrapper(user_id, start_date: int, end_date: int) -> dict[str, float]:
    start_date = _to_int_ts(start_date)
    end_date = _to_int_ts(end_date)

    print(f"DEBUG: user_id={user_id}, start={start_date}, end={end_date}")
    print(f"DEBUG: start={datetime.fromtimestamp(start_date, tz=timezone.utc)}, end={datetime.fromtimestamp(end_date, tz=timezone.utc)}")
    

    if start_date > end_date:
        raise ValueError("start_date must be <= end_date")
    


    qs = (
        models.Transactions.objects
        .filter(user_id_id=user_id, date__gte=start_date, date__lte=end_date)
        .values_list("category", "amount")
    )

    all_txns = models.Transactions.objects.filter(user_id_id=user_id)

    print(f"DEBUG: query count={qs.count()}")
    print(f"DEBUG: total transactions for user={all_txns.count()}")

    totals = defaultdict(Decimal)
    for category, amount in qs:
        amt = Decimal(str(amount))
        if amt < 0:
            amt = -amt
        totals[category or "Uncategorized"] += amt

    return {k: float(v.quantize(Decimal("0.01"))) for k, v in totals.items()}

get_date_range_tool = models.ChatbotTool(
    name="get_date_range",
    description="Converts a month and year into Unix timestamps. Always call this first before calling get_spend_summary or get_prediction.",
    params=[
        models.ToolParam(name="month", data_type=int, description="Month as integer (1-12)", is_required=True),
        models.ToolParam(name="year", data_type=int, description="Four-digit year e.g. 2025", is_required=True),
    ],
    func=None,
    return_type=dict,
    return_description="dict with start_timestamp and end_timestamp as Unix integers",
    constraints="month must be 1-12. year must be 4 digits.",
    usage_examples=[
        "Always call before get_spend_summary to get correct timestamps",
        "User asks about 'December 2025' → call with month=12, year=2025",
        "User asks about 'last month' → calculate month/year from today's date and call this",
    ]
)

get_spend_summary_tool = models.ChatbotTool(
    name="get_spend_summary",
    description="Retrieves a summary of the user's spending transactions within a specific date range for analysis",
    params=[
        models.ToolParam(
            name="start_date",
            data_type=int,
            description="Start date as Unix timestamp (seconds since epoch)",
            is_required=True
        ),
        models.ToolParam(
            name="end_date",
            data_type=int,
            description="End date as Unix timestamp (seconds since epoch)",
            is_required=True
        ),
    ],
    func=None,
    return_type=dict,
    return_description="dictionary mapping each spending category to its total amount spent in the period",
    constraints="start_date must be <= end_date. Range should not exceed 1 year.",
    usage_examples=[
        "User asks about spending over the last month",
        "User wants to review transactions from a specific time period",
        "User asks 'how much did I spend in December?'",
    ]
)

def get_prediction_wrapper(user_id, start_date: int, end_date: int) -> dict[str, float]:

    if start_date > end_date:
        raise ValueError("start_date must be <= end_date")

    start_dt = _ts_to_dt(start_date)
    end_dt = _ts_to_dt(end_date)

    # look back same-length window immediately before start_date
    hist_end_ts = start_date - 1
    window_secs = end_date - start_date
    hist_start_ts = hist_end_ts - window_secs

    historical_by_cat = get_spend_summary_wrapper(user_id, hist_start_ts, hist_end_ts)
    hist_total = sum(historical_by_cat.values())

    hist_days = max(1, (_ts_to_dt(hist_end_ts).date() - _ts_to_dt(hist_start_ts).date()).days + 1)
    daily_total = hist_total / hist_days

    result: Dict[str, float] = {}

    cur = start_dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    end_month_start = end_dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    while cur <= end_month_start:
        month_last_day = calendar.monthrange(cur.year, cur.month)[1]
        month_start = cur
        month_end = cur.replace(day=month_last_day, hour=23, minute=59, second=59, microsecond=0)

        seg_start = max(month_start, start_dt)
        seg_end = min(month_end, end_dt)

        if seg_start <= seg_end:
            days = (seg_end.date() - seg_start.date()).days + 1
            result[_month_key(cur)] = round(daily_total * days, 2)

        cur = _next_month(cur)

    return result

get_prediction_tool = models.ChatbotTool(
    name="get_prediction",
    description="Predicts the user's total spending per month for a future date range using recent history as a baseline forecast.",
    params=[
        models.ToolParam(
            name="start_date",
            data_type=int,
            description="Start date as Unix timestamp (seconds since epoch)",
            is_required=True
        ),
        models.ToolParam(
            name="end_date",
            data_type=int,
            description="End date as Unix timestamp (seconds since epoch)",
            is_required=True
        ),
    ],
    return_type=dict,
    return_description="dictionary mapping each month (YYYY-MM) to predicted total spending for that month",
    func=None,
    constraints="start_date must be <= end_date. Best results when history contains enough transactions; keep ranges <= 1 year.",
    usage_examples=[
        "User asks: 'Predict how much I'll spend next month'",
        "User asks: 'Forecast my spending for March'",
    ]
)

def build_tools(user_id):
    def make_spend_summary(start_date: int, end_date: int) -> dict:
        """Retrieves a summary of the user's spending within a date range.
        
        Args:
            start_date: Start date as Unix timestamp (seconds since epoch)
            end_date: End date as Unix timestamp (seconds since epoch)
        """
        return get_spend_summary_wrapper(user_id, start_date, end_date)
    
    def make_prediction(start_date: int, end_date: int) -> dict:
        """Predicts the user's total spending per month for a future date range.
        
        Args:
            start_date: Start date as Unix timestamp (seconds since epoch)
            end_date: End date as Unix timestamp (seconds since epoch)
        """
        return get_prediction_wrapper(user_id, start_date, end_date)

    make_spend_summary.__name__ = "get_spend_summary"
    make_prediction.__name__ = "get_prediction"

    spend = get_spend_summary_tool.model_copy(deep=True)
    spend.func = make_spend_summary

    pred = get_prediction_tool.model_copy(deep=True)
    pred.func = make_prediction

    def make_date_range(month: int, year: int) -> dict:
        """Converts a month and year into Unix timestamps.
        
        Args:
            month: Month as integer (1-12)
            year: Four-digit year e.g. 2025
        """
        return get_date_range_wrapper(user_id, month, year)
    
    make_date_range.__name__ = "get_date_range"
    date_range = get_date_range_tool.model_copy(deep=True)
    date_range.func = make_date_range

    return {"get_spend_summary": spend, "get_prediction": pred, "get_date_range": date_range}

CHATBOT_TOOLS = { 
    "get_spend_summary": get_spend_summary_tool,
    "get_prediction": get_prediction_tool,
}
