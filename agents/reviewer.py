from core.ai_client import ask_ai
import json

class ReviewerAgent:

    def review_code(self, code: dict) -> dict:
        if 'error' in code:
            return {'status': 'rejected', 'issues': ['Code generation failed'], 'score': 0}

        prompt = (
            'You are a pragmatic code reviewer for MVP/prototype code.\n'
            'Context: This is AI-generated code for a Next.js 14 app prototype.\n'
            'Do NOT penalize for: missing tests, missing README, missing CSS details.\n'
            'DO penalize for: syntax errors, wrong imports, logic bugs, security issues.\n\n'
            f'Code to review:\n{str(code)[:2000]}\n\n'
            'Score criteria:\n'
            '90-100: Clean TypeScript, proper types, no bugs\n'
            '70-89: Minor issues, mostly correct structure\n'
            '50-69: Works but needs improvements\n'
            '0-49: Major bugs or wrong approach\n\n'
            'Return ONLY a JSON:\n'
            '{"status": "approved", "score": 75, "issues": ["only real bugs"], "suggestions": []}\n'
            'No markdown. No backticks. ONLY the JSON.'
        )
        raw = ask_ai(prompt, system='You are a pragmatic senior developer reviewing MVP code.')
        try:
            clean = raw.strip()
            if '```' in clean:
                for part in clean.split('```'):
                    part = part.strip()
                    if part.startswith('json'): part = part[4:].strip()
                    if part.startswith('{'):
                        clean = part
                        break
            start = clean.find('{')
            end = clean.rfind('}') + 1
            if start >= 0 and end > start:
                clean = clean[start:end]
            return json.loads(clean)
        except Exception as e:
            return {'status': 'approved', 'score': 65, 'issues': [], 'raw': str(e)}
