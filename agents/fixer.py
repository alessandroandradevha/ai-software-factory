from core.ai_client import ask_ai
from core.learning import get_learning_context
import json

class FixerAgent:

    def fix_code(self, code, errors, attempt):
        print(f'[Fixer] Attempt {attempt} - fixing {len(errors)} errors...')
        history_context = get_learning_context()
        errors_str = json.dumps(errors, indent=2)
        code_str = json.dumps(code)[:1500]
        prompt = (
            'You are a senior developer fixing TypeScript/React code.\n'
            f'LEARNING CONTEXT (what worked before):\n{history_context}\n\n'
            f'ERRORS TO FIX (attempt {attempt} of 3):\n{errors_str}\n\n'
            f'CURRENT CODE:\n{code_str}\n\n'
            'Rules:\n'
            '1. Fix ALL errors listed\n'
            '2. Use environment variables instead of hardcoded credentials\n'
            '3. Add proper TypeScript types\n'
            '4. Add error handling\n'
            'Return ONLY a JSON with keys: pages, components, lib. No markdown.'
        )
        raw = ask_ai(prompt, system='You are a senior TypeScript developer.')
        try:
            clean = raw.strip()
            if '```' in clean:
                parts = clean.split('```')
                for part in parts:
                    if '{' in part:
                        clean = part
                        if clean.startswith('json'):
                            clean = clean[4:]
                        break
            fixed = json.loads(clean)
            print(f'[Fixer] Fixed successfully on attempt {attempt}')
            return fixed
        except Exception as e:
            print(f'[Fixer] Parse error on attempt {attempt}: {e}')
            return code
