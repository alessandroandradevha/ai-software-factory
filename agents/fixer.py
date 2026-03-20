from core.ai_client import ask_ai
from core.learning import get_learning_context
import json

class FixerAgent:

    def fix_code(self, code, errors, attempt):
        print(f'[Fixer] Attempt {attempt} - fixing {len(errors)} errors...')
        history = get_learning_context()
        fixed = {}

        for folder, files in code.items():
            if not isinstance(files, dict):
                continue
            fixed[folder] = {}
            for filename, content in files.items():
                prompt = (
                    f'Fix this TypeScript/React file. Attempt {attempt} of 3.\n'
                    f'Learning context: {history[:200]}\n'
                    f'Errors to fix: {str(errors[:3])}\n\n'
                    f'Current code:\n{str(content)[:1500]}\n\n'
                    'Rules:\n'
                    '1. Fix ALL errors\n'
                    '2. Use env variables not hardcoded credentials\n'
                    '3. Add TypeScript types\n'
                    '4. Add error handling\n'
                    'Return ONLY raw TypeScript code. No JSON. No markdown. No backticks.'
                )
                try:
                    result = ask_ai(prompt, system='You are a senior TypeScript developer. Return only raw code.')
                    if '```' in result:
                        for part in result.split('```'):
                            part = part.strip()
                            if part.startswith('typescript'): part = part[10:].strip()
                            if part.startswith('tsx'): part = part[3:].strip()
                            if 'import' in part or 'export' in part or 'const' in part:
                                result = part
                                break
                    fixed[folder][filename] = result
                except Exception as e:
                    print(f'[Fixer] Error fixing {folder}/{filename}: {e}')
                    fixed[folder][filename] = content

        print(f'[Fixer] Fixed successfully on attempt {attempt}')
        return fixed
