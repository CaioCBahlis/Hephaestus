from datetime import datetime

from chatbot import models


#  === GET SPENDING SUMMARY TOOL ===
def get_spend_summary(start_date: int, end_date: int) -> dict[str, float]:
    '''
        Transactions = []
        for transaction in Transactions.objects.filter(id=user_id):
            
            
            date = int(datetime.fromisoformat(transaction.date))

            if date >= start_date and date <= end_date:
                Transactions.append(transaction)

        return transaction
    '''
    # This is a test for the tool, will delete
    test_spending_dict = {
        "Going out": 250.49,
        "Online subscriptions": 99.29,
        "Travel": 1500.77
    }

    return test_spending_dict



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
        models.ToolParam(
            name="user_id",
            data_type=str,
            description="Unique identifier for the user",
            is_required=True
        )
    ],
    return_type=dict[str, float],
    return_description="dictionary mapping each spending category to its total amount spent in the period",
    func=get_spend_summary,
    constraints="start_date must be less than or equal to end_date. Date range should not exceed 1 year for performance reasons.",
    usage_examples=[
        "User asks about spending over the last month",
        "User wants to review transactions from a specific time period",
        "User asks 'how much did I spend in December?'",
        "User wants to analyze spending patterns between two dates"
    ]
)  

get_prediction = models.ChatbotTool(
    name="get_prediction",
    description="Creates a prediction of user's future transactions based on past financial data",
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
        models.ToolParam(
            name="user_id",
            data_type=str,
            description="Unique identifier for the user",
            is_required=True
        )
    ],
    return_type=dict[str, float],
    return_description="dictionary mapping each spending category to its total amount spent in the period",
    func=get_spend_summary,
    constraints="start_date must be less than or equal to end_date. Date range should not exceed 1 year for performance reasons.",
    usage_examples=[
        "User asks to predict how much they will spend in the next months",
        "User wants a linear regression based on their spending habits for the next months",
        "User asks how much am I going to spend in the next month",
        "User wants to analyze spending patterns in the next motnhs"
    ]
)  


# === NEXT TOOL ===

CHATBOT_TOOLS = { 
    "get_spend_summary": get_spend_summary_tool,
    "get_prediction": get_prediction
}
