from models import Transactions
from datetime import datetime


def get_spend_summary(start_date, end_date, user_id) -> dict:

    Transactions = []
    for transaction in Transactions.objects.filter(id=user_id):
        
        
        date = int(datetime.fromisoformat(transaction.date))

        if date >= start_date and date <= end_date:
            Transactions.append(transaction)

    return transaction


