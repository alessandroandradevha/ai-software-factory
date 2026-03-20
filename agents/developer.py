from core.ai_client import ask_ai
import json

class DeveloperAgent:

    def generate_code(self, architecture: dict) -> dict:
        # Pede ao Claude para definir os arquivos corretos para este modulo
        plan_prompt = (
            'You are a senior TypeScript developer working on Senseday app.\n'
            f'Module to build: {architecture.get(chr(102)+chr(114)+chr(111)+chr(110)+chr(116)+chr(101)+chr(110)+chr(100))}\n'
            f'Features: {str(architecture.get(chr(102)+chr(101)+chr(97)+chr(116)+chr(117)+chr(114)+chr(101)+chr(115)))[:300]}\n\n'
            'List exactly 3 files to create for this module.\n'
            'Use clean filenames WITHOUT extensions like: components/modals/SnoozeModal\n'
            'For root-level files use folder=root, filename=.env.example\n'
            'NEVER include .ts or .tsx in the filename field\n'
            'Return ONLY a JSON array: [{"folder": "components/modals", "filename": "SnoozeModal", "purpose": "snooze task modal"}]\n'
            'No markdown. No backticks. ONLY the JSON array.'
        )
        files_raw = ask_ai(plan_prompt, system='You are a senior TypeScript developer.')
        try:
            clean = files_raw.strip()
            start = clean.find('[')
            end = clean.rfind(']') + 1
            files_to_generate = json.loads(clean[start:end]) if start >= 0 else []
        except:
            files_to_generate = [
                {'folder': 'components', 'filename': 'MainComponent', 'purpose': 'main component'},
                {'folder': 'hooks', 'filename': 'useModule', 'purpose': 'module hook'},
                {'folder': 'lib', 'filename': 'utils', 'purpose': 'utilities'},
            ]

        result = {}
        for file_def in files_to_generate[:3]:
            folder = file_def.get('folder', 'components')
            filename = file_def.get('filename', 'Component')
            purpose = file_def.get('purpose', 'component')
            prompt = (
                'You are a senior TypeScript developer working on Senseday v9.0.0.\n'
                'Tech stack: Next.js 14 App Router, TypeScript, Zustand, Firebase, Tailwind, Framer Motion, lucide-react.\n'
                'Existing imports available: useStore from @/lib/store, useAuth from @/contexts/AuthContext\n'
                'CSS vars available: var(--bg-primary), var(--text-primary), var(--border-default)\n\n'
                f'Generate file: {folder}/{filename}.tsx\n'
                f'Purpose: {purpose}\n'
                f'Module context: {str(architecture.get(chr(102)+chr(101)+chr(97)+chr(116)+chr(117)+chr(114)+chr(101)+chr(115)))[:200]}\n\n'
                'Requirements:\n'
                '- Add use client directive if interactive\n'
                '- Use TypeScript interfaces for all props\n'
                '- Use existing Zustand store for state\n'
                '- Use CSS variables for colors (not hardcoded)\n'
                '- Export as default\n\n'
                'Return ONLY the raw TypeScript code. No JSON. No markdown. No backticks.'
            )
            try:
                code = ask_ai(prompt, system='Return only raw TypeScript/React code. No markdown.')
                if '```' in code:
                    for part in code.split('```'):
                        part = part.strip()
                        for prefix in ['typescript', 'tsx', 'ts', 'jsx']:
                            if part.startswith(prefix): part = part[len(prefix):].strip()
                        if 'import' in part or 'export' in part or 'const' in part or 'interface' in part:
                            code = part
                            break
                if folder not in result:
                    result[folder] = {}
                result[folder][filename] = code
                print(f'[Developer] Generated {folder}/{filename}.tsx')
            except Exception as e:
                print(f'[Developer] Error: {e}')
        return result
