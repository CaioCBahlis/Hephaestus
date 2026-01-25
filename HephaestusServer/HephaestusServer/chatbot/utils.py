from typing import Any
import csv
from google.genai import types, chats

from chatbot import gemini_config, helper_funcs, tools, models

def _gemini_execute_tool(tool_name: str, tool_kwargs: dict[str, Any]) -> Any:
    if tool_name not in tools.CHATBOT_TOOLS:
        raise ValueError(f"Tool {tool_name} not found in available tools.")

    tool = tools.CHATBOT_TOOLS[tool_name]
    return tool.execute_tool_func(**tool_kwargs)

def _extract_text_from_response(response: types.GenerateContentResponse) -> str | None:
    candidates = response.candidates
    if not candidates:
        return None

    content = candidates[0].content
    if not content or not content.parts:
        return response.text if response.text else None

    return response.text if response.text else None


def _has_function_calls(parts: list[types.Part]) -> bool:
    return any(hasattr(part, 'function_call') for part in parts)


def _extract_function_call_params(part: types.Part) -> tuple[str, dict[str, Any]] | None:
    if not hasattr(part, 'function_call'):
        return None

    func_call = part.function_call
    if not func_call:
        return None

    func_name = func_call.name
    if not func_name:
        return None

    func_args = func_call.args

    if not func_args:
        raise Exception("Tool contains wrong information")

    return func_name, func_args


def _process_function_calls(parts: list[types.Part]) -> list[types.Part]:
    function_responses = []

    for part in parts:
        result = _extract_function_call_params(part)
        if not result:
            continue

        func_name, func_args = result

        tool_result = _gemini_execute_tool(
            tool_name=func_name,
            tool_kwargs=func_args
        )

        function_responses.append(
            types.Part.from_function_response(
                name=func_name,
                response=tool_result
            )
        )

    return function_responses

def _parse_to_gemini(raw_messages: list[dict[str, Any]]) -> list[types.ContentOrDict]:
    parsed_messages = []
    
    for message in raw_messages:
        parsed_messages.append(
            types.Content(
                role="model" if not message["UserMessage"] else "user",
                parts=[types.Part(text=message["Text"])]
            )
        )
    
    return parsed_messages

def get_gemini_response(user_data: dict[str, Any], conversation_history: list[dict[str, Any]]) -> str:
    client, config = gemini_config.generate_chatbot_model(user_data=user_data)
    
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
            result = _gemini_execute_tool(
                tool_name=call.name,
                tool_kwargs=call.args
            )
            
            tool_responses.append(
                types.Part.from_function_response(
                    name=call.name,
                    response={'result': result}
                )
            )

        current_input = tool_responses

    raise Exception("Model looped too many times")

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
                    date=helper_funcs.date_to_int(row["Date"].strip())
                    amount=float(row["Amount"].strip())
                    category=row["Category"].strip()
                    balance=float(row["Running Balance"].strip())
                    description=row["Description"].strip()
                    models.Transactions.objects.create(date=date, amount=amount, balance=balance, category=category, description=description)
                    
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
