from core.ai_client import ask_ai
import json

class DeveloperAgent:

    def generate_code(self, architecture: dict) -> dict:
        prompt = f"""
You are a senior developer. Based on this architecture, generate a Next.js application.

Architecture:
{json.dumps(architecture, indent=2)}

Return ONLY a JSON object with this structure:
{{
  "pages": {{
    "index": "full content of pages/index.tsx here"
  }},
  "components": {{
    "Dashboard": "full content of Dashboard.tsx here"
  }},
  "lib": {{
    "db": "full content of lib/db.ts here"
  }}
}}

Return ONLY the JSON. No explanation. No markdown.
"""
        raw = ask_ai(prompt)
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            print(f"[DeveloperAgent] Parse error: {e}")
            return {"error": str(e), "raw": raw[:300]}
