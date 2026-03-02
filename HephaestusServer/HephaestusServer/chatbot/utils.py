from datetime import datetime, timezone
from typing import Any
import csv
from google.genai import types, chats
from pathlib import Path

from chatbot import gemini_config, helper_funcs, tools, models

def _parse_to_gemini(raw_messages: list[dict[str, Any]]) -> list[types.ContentOrDict]:
    parsed = []
    for message in raw_messages:
        role = "user" if message["UserMessage"] else "model"
        parsed.append(
            types.Content(role=role, parts=[types.Part(text=message["Text"])])
        )
    
    # Gemini requires history to start with 'user'
    while parsed and parsed[0].role == "model":
        parsed.pop(0)
    
    return parsed

def get_gemini_response(user_id, user_data: dict[str, Any], conversation_history: list[dict[str, Any]]) -> str:
    tool_map = tools.build_tools(user_id)  

    client, config = gemini_config.generate_chatbot_model(
        user_data=user_data,
        tool_map=tool_map,  
    )


    history_for_chat = _parse_to_gemini(conversation_history[:-1])
    
    chat = client.chats.create(
        model=gemini_config.GEMINI_MODEL,
        config=config,
        history=history_for_chat
    )

    current_input = conversation_history[-1]["Text"]

    for _ in range(5):
        response = chat.send_message(current_input)
        
        if not response.function_calls:
            return response.text

        tool_responses = []
        for call in response.function_calls:
            tool = tool_map[call.name]
            result = tool.func(**call.args)

        if call.name == "get_prediction_chart":
            return {"type": "chart", "data": result}

        tool_responses.append(
            types.Part.from_function_response(
                name=call.name,
                response={"result": result}
            )
        )

        current_input = tool_responses

    raise Exception("Model looped too many times")

def ParseBankStatement(FilePath: str, user_id):

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
    ParsePseudoStatement(FilePath=FilePath, user_id=user_id)


def ParsePseudoStatement(FilePath, user_id):
    print(f"Attempting to parse: {FilePath}, extension: {Path(FilePath).suffix}")
    

    try:
        with open(FilePath, "r") as f:
            csv_reader = csv.DictReader(f)
            for row in csv_reader:
                    date = helper_funcs.date_to_int(row["Date"].strip(), default_year=2025)
                    amount=float(row["Amount"].strip())
                    category=row["Category"].strip()
                    balance=float(row["Running Balance"].strip())
                    description=row["Description"].strip()
                    models.Transactions.objects.create(
                        user_id_id=user_id,
                        date=date, 
                        amount=amount, 
                        balance=balance, 
                        category=category, 
                        description=description
                    )
                    
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