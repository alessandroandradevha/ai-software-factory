from core.ai_client import ask_ai
import json

class PlannerAgent:

    def create_product_plan(self, idea: dict) -> dict:
        prompt = f"""
Create a detailed product plan for this app idea:
Name: {idea['name']}
Description: {idea['description']}

Return ONLY a JSON object:
{{
  "name": "app name",
  "description": "app description",
  "target_audience": "who this is for",
  "features": ["feature 1", "feature 2", "feature 3"],
  "tech_stack": ["Next.js", "Supabase", "Tailwind"],
  "monetization": "how to monetize",
  "complexity": "low"
}}
Return ONLY the JSON. No explanation. No markdown.
"""
        raw = ask_ai(prompt)
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except:
            return {"name": idea["name"], "description": idea["description"], "features": [], "raw": raw}
