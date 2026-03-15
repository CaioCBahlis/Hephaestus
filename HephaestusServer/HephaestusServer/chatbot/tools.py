from collections import defaultdict
from datetime import datetime, timezone
from decimal import Decimal
from typing import Dict, Optional, Union
import calendar

from chatbot import models


def get_date_range_wrapper(user_id, month: int, year: int) -> dict:
    """Returns the Unix timestamp range for a given month and year."""
    start = datetime(year, month, 1, tzinfo=timezone.utc)
    last_day = calendar.monthrange(year, month)[1]
    end = datetime(year, month, last_day, 23, 59, 59, tzinfo=timezone.utc)
    return {
        "start_timestamp": int(start.timestamp()),
        "end_timestamp": int(end.timestamp()),
        "description": f"{start.strftime('%B %Y')}",
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

    if start_date > end_date:
        raise ValueError("start_date must be <= end_date")

    qs = (
        models.Transactions.objects
        .filter(user_id_id=user_id, date__gte=start_date, date__lte=end_date)
        .values_list("category", "amount")
    )

    totals = defaultdict(Decimal)
    for category, amount in qs:
        amt = Decimal(str(amount))
        if amt < 0:
            amt = -amt
        totals[category or "Uncategorized"] += amt

    return {k: float(v.quantize(Decimal("0.01"))) for k, v in totals.items()}


def get_prediction_wrapper(user_id, start_date: int, end_date: int) -> dict[str, float]:
    start_date = _to_int_ts(start_date)
    end_date = _to_int_ts(end_date)

    if start_date > end_date:
        raise ValueError("start_date must be <= end_date")

    start_dt = _ts_to_dt(start_date)
    end_dt = _ts_to_dt(end_date)

    hist_end_ts = start_date - 1
    window_secs = end_date - start_date
    hist_start_ts = hist_end_ts - window_secs

    historical_by_cat = get_spend_summary_wrapper(user_id, hist_start_ts, hist_end_ts)
    hist_total = sum(historical_by_cat.values())

    hist_days = max(
        1,
        (_ts_to_dt(hist_end_ts).date() - _ts_to_dt(hist_start_ts).date()).days + 1,
    )
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


def get_graph_data_wrapper(
    user_id,
    start_date: int,
    end_date: int,
    mode: str,
    metric: str = "spending",
    category: Optional[str] = None,
    group_by: str = "month",
) -> dict[str, float]:
    start_date = _to_int_ts(start_date)
    end_date = _to_int_ts(end_date)

    if start_date > end_date:
        raise ValueError("start_date must be <= end_date")

    if group_by != "month":
        raise ValueError("group_by must currently be 'month'")

    if mode not in {"actual", "prediction"}:
        raise ValueError("mode must be 'actual' or 'prediction'")

    if metric != "spending":
        raise ValueError("metric must currently be 'spending'")

    if mode == "prediction":
        if category:
            raise ValueError("category filtering is not currently supported for prediction mode")
        return get_prediction_wrapper(user_id, start_date, end_date)

    qs = models.Transactions.objects.filter(
        user_id_id=user_id,
        date__gte=start_date,
        date__lte=end_date,
    )

    if category:
        qs = qs.filter(category__iexact=category)

    qs = qs.values_list("date", "amount")

    buckets = defaultdict(Decimal)

    for ts, amount in qs:
        dt = _ts_to_dt(int(ts))
        amt = Decimal(str(amount))

        if amt < 0:
            amt = -amt

        buckets[_month_key(dt)] += amt

    start_dt = _ts_to_dt(start_date).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    end_dt = _ts_to_dt(end_date).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    result: dict[str, float] = {}
    cur = start_dt

    while cur <= end_dt:
        key = _month_key(cur)
        result[key] = float(buckets.get(key, Decimal("0.00")).quantize(Decimal("0.01")))
        cur = _next_month(cur)

    return result



get_date_range_tool = models.ChatbotTool(
    name="get_date_range",
    description="Converts a month and year into Unix timestamps. Always call this first before calling get_spend_summary, get_prediction, or get_graph_data.",
    params=[
        models.ToolParam(name="month", data_type=int, description="Month as integer (1-12)", is_required=True),
        models.ToolParam(name="year", data_type=int, description="Four-digit year e.g. 2025", is_required=True),
    ],
    func=None,
    return_type=dict,
    return_description="dict with start_timestamp and end_timestamp as Unix integers",
    constraints="month must be 1-12. year must be 4 digits.",
    usage_examples=[
        "Always call before spend or graph tools to get correct timestamps",
        "User asks about 'December 2025' → call with month=12, year=2025",
        "User asks about 'last month' → calculate month/year from today's date and call this",
    ],
)

get_spend_summary_tool = models.ChatbotTool(
    name="get_spend_summary",
    description="Retrieves a summary of the user's spending transactions within a specific date range for analysis",
    params=[
        models.ToolParam(
            name="start_date",
            data_type=int,
            description="Start date as Unix timestamp (seconds since epoch)",
            is_required=True,
        ),
        models.ToolParam(
            name="end_date",
            data_type=int,
            description="End date as Unix timestamp (seconds since epoch)",
            is_required=True,
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
    ],
)

get_prediction_tool = models.ChatbotTool(
    name="get_prediction",
    description="Predicts the user's total spending per month for a future date range using recent history as a baseline forecast.",
    params=[
        models.ToolParam(
            name="start_date",
            data_type=int,
            description="Start date as Unix timestamp (seconds since epoch)",
            is_required=True,
        ),
        models.ToolParam(
            name="end_date",
            data_type=int,
            description="End date as Unix timestamp (seconds since epoch)",
            is_required=True,
        ),
    ],
    return_type=dict,
    return_description="dictionary mapping each month (YYYY-MM) to predicted total spending for that month",
    func=None,
    constraints="start_date must be <= end_date. Best results when history contains enough transactions; keep ranges <= 1 year.",
    usage_examples=[
        "User asks: 'Predict how much I'll spend next month'",
        "User asks: 'Forecast my spending for March'",
    ],
)

get_graph_data_tool = models.ChatbotTool(
    name="get_graph_data",
    description="Returns raw graph-ready data mapping YYYY-MM to numeric values. Use this when the user wants a graph, chart, trend, plot, or visualization.",
    params=[
        models.ToolParam(
            name="start_date",
            data_type=int,
            description="Start date as Unix timestamp",
            is_required=True,
        ),
        models.ToolParam(
            name="end_date",
            data_type=int,
            description="End date as Unix timestamp",
            is_required=True,
        ),
        models.ToolParam(
            name="mode",
            data_type=str,
            description="Either 'actual' or 'prediction'",
            is_required=True,
        ),
        models.ToolParam(
            name="metric",
            data_type=str,
            description="Currently only supports 'spending'",
            is_required=True,
        ),
        models.ToolParam(
            name="group_by",
            data_type=str,
            description="Currently only supports 'month'",
            is_required=True,
        ),
        models.ToolParam(
            name="category",
            data_type=str,
            description="Optional category filter for actual spending graphs",
            is_required=False,
        ),
    ],
    func=None,
    return_type=dict,
    return_description="raw dictionary mapping YYYY-MM to numeric values for chart rendering",
    constraints="start_date must be <= end_date. mode must be actual or prediction. metric must currently be spending. group_by must currently be month.",
    usage_examples=[
        "User says 'show me a graph of my spending'",
        "User says 'visualize my spending over the last 6 months'",
        "User says 'show my grocery spending by month'",
        "User says 'graph my predicted spending for next quarter'",
    ],
)


def build_tools(user_id):
    def make_spend_summary(start_date: int, end_date: int) -> dict:
        return get_spend_summary_wrapper(user_id, start_date, end_date)

    def make_prediction(start_date: int, end_date: int) -> dict:
        return get_prediction_wrapper(user_id, start_date, end_date)

    def make_graph_data(
        start_date: int,
        end_date: int,
        mode: str,
        metric: str,
        group_by: str,
        category: Optional[str] = None,
    ) -> dict:
        return get_graph_data_wrapper(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            mode=mode,
            metric=metric,
            group_by=group_by,
            category=category,
        )

    def make_date_range(month: int, year: int) -> dict:
        return get_date_range_wrapper(user_id, month, year)

    make_spend_summary.__name__ = "get_spend_summary"
    make_prediction.__name__ = "get_prediction"
    make_graph_data.__name__ = "get_graph_data"
    make_date_range.__name__ = "get_date_range"

    spend = get_spend_summary_tool.model_copy(deep=True)
    spend.func = make_spend_summary

    pred = get_prediction_tool.model_copy(deep=True)
    pred.func = make_prediction

    graph = get_graph_data_tool.model_copy(deep=True)
    graph.func = make_graph_data

    date_range = get_date_range_tool.model_copy(deep=True)
    date_range.func = make_date_range

    return {
        "get_spend_summary": spend,
        "get_prediction": pred,
        "get_graph_data": graph,
        "get_date_range": date_range,
    }


CHATBOT_TOOLS = {
    "get_spend_summary": get_spend_summary_tool,
    "get_prediction": get_prediction_tool,
    "get_graph_data": get_graph_data_tool,
    "get_date_range": get_date_range_tool,
}
