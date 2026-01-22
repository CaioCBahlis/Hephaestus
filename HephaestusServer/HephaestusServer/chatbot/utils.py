from typing import Any
import csv
from . import gemini_config
from datetime import date
from chatbot.models import Transactions
from chatbot.helper_funcs import date_to_int


# TODO: add data model for conversation history for automatic type checking
def get_chatbot_response(conversation_history: list[dict[str, any]]) -> str:
    model = gemini_config.chatbot_model


def ParseToGemini(RawMessages: list[dict[str, Any]]):


    ParsedMessages = []
    for Message in RawMessages:

        ParsedMessages.append(
            {"role": "model" if Message["UserMessage"] == False else "user",
            "parts": [Message["Text"]]
            }
        )
    


    return ParsedMessages


def ParseBankStatement(FilePath: str):

    """"
    BankType = GetBankType(FilePath)

    match BankType:
        case "Chase":
            ParseChase(FilePath)
        case "BankOfAmerica":
            ParseBankOfAmerica(FilePath)
        case _:
            print("Bank Not Found")
            return

    return 
    """
    ParsePseudoStatement(FilePath=FilePath)


def ParsePseudoStatement(FilePath):

    try:
        with open(FilePath, "r") as f:
            csv_reader = csv.DictReader(f)
            for row in csv_reader:
                    date=date_to_int(row["Date"].strip())
                    amount=float(row["Amount"].strip())
                    category=row["Category"].strip()
                    balance=float(row["Running Balance"].strip())
                    description=row["Description"].strip()
                    Transactions.objects.create(date=date, amount=amount, balance=balance, category=category, description=description)
                    
    except FileNotFoundError:
        print(f"Not file found at {FilePath}")

    except Exception as e:
        print(f"Error Occured, got: {e}")




def GetBankType(FilePath: str):

    try:
        with open(FilePath, "r") as f:

            csv_reader = csv.reader(f, delimiter=",")

            for row in csv_reader:
                print(row)

        

    except FileNotFoundError:
        print(f"Not file found at {FilePath}")

    except Exception as e:
        print(f"Error Occured, got: {e}")


def ParseChase(FilePath: str):

    try:
        with open(FilePath, "r") as f:

            csv_reader = csv.reader(f, delimiter=",")

            for row in csv_reader:
                print(row)

        

    except FileNotFoundError:
        print(f"Not file found at {FilePath}")

    except Exception as e:
        print(f"Error Occured, got: {e}")

def ParseBankOfAmerica(FilePath: str):

    try:
        with open(FilePath, "r") as f:

            csv_reader = csv.reader(f, delimiter=",")

            for row in csv_reader:
                print(row)

        

    except FileNotFoundError:
        print(f"Not file found at {FilePath}")

    except Exception as e:
        print(f"Error Occured, got: {e}")


