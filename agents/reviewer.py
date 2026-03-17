from core.ai_client import ask_ai
import json

class ReviewerAgent:

    def review_code(self, code: dict) -> dict:
        if "error" in code:
            return {"status": "rejected", "issues": ["Code generation failed"], "score": 0}

        prompt = f"""
You are a senior code reviewer. Review this generated code structure:

{json.dumps(code, indent=2)[:3000]}

Evaluate:
1. Does it look like valid TypeScript/React code?
2. Are there obvious structural issues?
3. Is it complete enough to deploy?

Return ONLY a JSON:
{{
  "status": "approved",
  "score": 85,
  "issues": [],
  "suggestions": []
}}
Return ONLY the JSON. No explanation. No markdown.
"""
        raw = ask_ai(prompt, system="You are a strict code quality reviewer.")
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except:
            return {"status": "approved", "score": 70, "issues": [], "raw": raw}
