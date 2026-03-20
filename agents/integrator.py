from core.ai_client import ask_ai
import json
import os

SENSEDAY_PATH = os.environ.get('SENSEDAY_PATH', '/home/runner/Senseday.app')

class IntegratorAgent:

    def analyze(self, module_name, generated_code):
        report = {
            'module': module_name,
            'new_files': [],
            'modified_files': [],
            'instructions': []
        }
        for folder, files in generated_code.items():
            if not isinstance(files, dict):
                continue
            for filename, content in files.items():
                clean = filename
                for ext in ['.tsx', '.ts']:
                    if clean.endswith(ext):
                        clean = clean[:-len(ext)]
                if folder == 'root':
                    real_path = os.path.join(SENSEDAY_PATH, clean)
                else:
                    real_path = os.path.join(SENSEDAY_PATH, folder, clean + '.tsx')
                    if not os.path.exists(real_path):
                        real_path = os.path.join(SENSEDAY_PATH, folder, clean + '.ts')
                if os.path.exists(real_path):
                    report['modified_files'].append({
                        'file': real_path.replace(SENSEDAY_PATH, ''),
                        'status': 'MODIFY EXISTING',
                        'action': 'Review carefully before replacing'
                    })
                else:
                    report['new_files'].append({
                        'file': f'{folder}/{clean}',
                        'status': 'NEW FILE',
                        'action': 'Safe to copy directly'
                    })
        prompt = (
            f'You are a senior developer reviewing generated code for Senseday v9.0.0.\n'
            f'Module: {module_name}\n'
            f'New files: {len(report[chr(110)+chr(101)+chr(119)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])}\n'
            f'Modified files: {len(report[chr(109)+chr(111)+chr(100)+chr(105)+chr(102)+chr(105)+chr(101)+chr(100)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])}\n'
            f'Code preview: {str(generated_code)[:500]}\n\n'
            'Write 3 clear integration instructions for a developer.\n'
            'Be specific about what to copy where.\n'
            'Return ONLY a JSON array: ["instruction 1", "instruction 2", "instruction 3"]\n'
            'No markdown. No backticks. ONLY the JSON array.'
        )
        raw = ask_ai(prompt, system='You are a senior developer writing integration instructions.')
        try:
            clean = raw.strip()
            start = clean.find('[')
            end = clean.rfind(']') + 1
            report['instructions'] = json.loads(clean[start:end])
        except:
            report['instructions'] = ['Review generated files in apps/ folder', 'Copy new files to Senseday project', 'Carefully merge modified files']
        return report

    def save_report(self, report):
        os.makedirs('data/reports', exist_ok=True)
        module = report['module'].lower().replace(' ', '-')
        path = f'data/reports/{module}.json'
        with open(path, 'w') as f:
            json.dump(report, f, indent=2)
        print(f'[Integrator] Report saved: {path}')
        print(f'[Integrator] New files: {len(report[chr(110)+chr(101)+chr(119)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])}')
        print(f'[Integrator] Files to modify: {len(report[chr(109)+chr(111)+chr(100)+chr(105)+chr(102)+chr(105)+chr(101)+chr(100)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])}')
        return path
