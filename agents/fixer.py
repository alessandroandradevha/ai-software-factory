from core.ai_client import ask_ai
import json

class FixerAgent:
    def fix_code(self, code, errors, attempt):
        print(f"[Fixer] Attempt {attempt}")
        prompt = "Fix this code: " + json.dumps(code)[:1000] + " Errors: " + str(errors) + " Return ONLY JSON with keys pages, components, lib."
        raw = ask_ai(prompt, system="You are a senior developer who fixes bugs.")
        try:
            clean = raw.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            return json.loads(clean)
        except:
            return code
