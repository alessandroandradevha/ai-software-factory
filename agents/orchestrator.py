from core.ai_client import ask_ai
import json
import os

ROADMAP_PATH = 'data/roadmap.json'

class OrchestratorAgent:

    def create_roadmap(self, app_description):
        print('[Orchestrator] Creating roadmap...')
        prompt = 'Divide this app into 5 to 8 sequential modules to build one per day. App: ' + app_description + ' Return ONLY a JSON array: [{"module": 1, "name": "name", "description": "what to build", "status": "pending"}]. No markdown.'
        raw = ask_ai(prompt, system='You are a senior software architect.')
        try:
            clean = raw.strip()
            if '```' in clean:
                for part in clean.split('```'):
                    if '[' in part:
                        clean = part[4:] if part.startswith('json') else part
                        break
            modules = json.loads(clean)
            os.makedirs('data', exist_ok=True)
            json.dump(modules, open(ROADMAP_PATH, 'w'), indent=2)
            print(f'[Orchestrator] Roadmap created with {len(modules)} modules')
            return modules
        except Exception as e:
            print(f'[Orchestrator] Error: {e}')
            return []

    def get_next_module(self):
        if not os.path.exists(ROADMAP_PATH):
            return None
        modules = json.load(open(ROADMAP_PATH))
        for m in modules:
            if m.get('status') == 'pending':
                print('[Orchestrator] Next: ' + m['name'])
                return m
        print('[Orchestrator] All modules completed!')
        return None

    def mark_done(self, module_number, score):
        modules = json.load(open(ROADMAP_PATH))
        for m in modules:
            if m.get('module') == module_number:
                m['status'] = 'done'
                m['score'] = score
                break
        json.dump(modules, open(ROADMAP_PATH, 'w'), indent=2)
        print(f'[Orchestrator] Module {module_number} marked done (score: {score})')

    def get_progress(self):
        if not os.path.exists(ROADMAP_PATH):
            return 'No roadmap found.'
        modules = json.load(open(ROADMAP_PATH))
        done = len([m for m in modules if m.get('status') == 'done'])
        total = len(modules)
        return f'Progress: {done}/{total} modules completed'
