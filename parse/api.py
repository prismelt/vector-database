import google.genai as gemini
from pydantic import BaseModel


def post(client: gemini.Client, base_text: str, schema: type[BaseModel]):
    response = client.models.generate_content(
        model="gemini-2.0-flash-001",
        contents=base_text,
        config={"response_mime_type": "application/json", "response_schema": schema},
    )
    print(f"AI RESPONSE: {response}")
    return response
