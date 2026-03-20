from core.ai_client import ask_ai
import json

class DeveloperAgent:

    def generate_code(self, architecture: dict) -> dict:
        # Gera cada arquivo separadamente para evitar problemas de JSON
        result = {}

        files = [
            ('pages', 'index', 'main page component with all features'),
            ('components', 'Dashboard', 'dashboard component'),
            ('lib', 'utils', 'utility functions'),
        ]

        for folder, filename, description in files:
            prompt = (
                f'Generate a TypeScript/React file for Next.js 14.\n'
                f'Architecture: {json.dumps(architecture)[:300]}\n'
                f'File: {folder}/{filename}.tsx\n'
                f'Purpose: {description}\n\n'
                'Return ONLY the raw TypeScript code.\n'
                'No JSON. No markdown. No backticks. Just the code.'
            )
            try:
                code = ask_ai(prompt, system='You are a senior TypeScript developer. Return only raw code, no markdown.')
                # Remove backticks se existirem
                if '```' in code:
                    parts = code.split('```')
                    for p in parts:
                        if 'import' in p or 'export' in p or 'const' in p:
                            code = p.strip()
                            if code.startswith('typescript') or code.startswith('tsx'):
                                code = code[10:].strip()
                            break
                if folder not in result:
                    result[folder] = {}
                result[folder][filename] = code
                print(f'[Developer] Generated {folder}/{filename}.tsx')
            except Exception as e:
                print(f'[Developer] Error generating {folder}/{filename}: {e}')
                if folder not in result:
                    result[folder] = {}
                result[folder][filename] = f'// Error generating {filename}: {e}'

        return result
