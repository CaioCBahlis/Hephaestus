from datetime import datetime

from datetime import datetime, timezone

def date_to_int(date_str: str, default_year: int = 2025) -> int:
    s = date_str.strip()

    # Full year formats
    for fmt in ("%m/%d/%Y", "%Y-%m-%d"):
        try:
            dt = datetime.strptime(s, fmt).replace(tzinfo=timezone.utc)
            return int(dt.timestamp())
        except ValueError:
            pass

    # Month/day only (like 12/15)
    for fmt in ("%m/%d", "%m-%d"):
        try:
            md = datetime.strptime(s, fmt)
            dt = md.replace(year=default_year, tzinfo=timezone.utc)
            return int(dt.timestamp())
        except ValueError:
            pass

    raise ValueError(f"Unsupported date format: {date_str}")

