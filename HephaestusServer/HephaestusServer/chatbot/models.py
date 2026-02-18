import inspect
from django.db import models
from pydantic import BaseModel
from typing import Any, Callable, Optional
import uuid

class Files(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    file_name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    user_id = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, blank=False)


class Conversations(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=20)
    messages = models.JSONField()
    user_id = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, blank=False)


class Transactions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(
        "accounts.UserAccount",
        on_delete=models.CASCADE,
        null=True, blank=True  
    )

    date = models.IntegerField()
    description = models.CharField(max_length=200)
    amount = models.FloatField()
    balance = models.FloatField()
    category = models.CharField(max_length=200)


# Internal Models, no need for as much data cleaning 
class ToolParam(BaseModel):
    name: str
    data_type: Any
    description: str
    is_required: bool

    def get_param_information(self) -> str:
        required = "REQUIRED" if self.is_required else "OPTIONAL"
        return f"\t- `{self.name}` ({self.data_type}: {required}): {self.description}"


class ChatbotTool(BaseModel):
    name: str
    description: str
    params: list[ToolParam]
    return_type: Any
    return_description: str
    func: Optional[Callable] = None
    constraints: str
    usage_examples: list[str]


    def get_tool_information(self) -> str:
        result = f"**{self.name.upper()} TOOL**\n{self.description}\n\nParameters:\n"
        
        for param in self.params:
            result += param.get_param_information() + "\n"
       
        if self.return_type and self.return_description: 
            result += f"This tool returns a {self.return_description} which has the following type: {self.return_type}\n"

        if self.constraints:
            result += f"\nConstraints:\n  {self.constraints}\n"
        
        if self.usage_examples:
            result += "\nUse when:\n"
            for example in self.usage_examples:
                result += f"\t- {example}\n"
    
        return result.rstrip()

    def get_tool_func(self) -> Callable:
        return self.func

    def execute_tool_func(self, user: Any = None, **kwargs) -> Any:
        if self.func is None:
            raise ValueError(f"Tool {self.name} has no callable func")

        sig = inspect.signature(self.func)
        if "user" in sig.parameters and user is not None:
            kwargs["user"] = user

        return self.func(**kwargs)