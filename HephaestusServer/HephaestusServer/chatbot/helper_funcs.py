from datetime import datetime

def date_to_int(date: str) -> int:

    input_format = "%m/%d/%Y"


    datetime_object = datetime.strptime(date, input_format)

    date_int = datetime_object.timestamp()

    return date_int
