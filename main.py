from core.pipeline import SoftwareFactoryPipeline
from agents.orchestrator import OrchestratorAgent
import os

APP_DESCRIPTION = open('data/senseday_description.txt').read()

orchestrator = OrchestratorAgent()

if not os.path.exists('data/roadmap.json'):
    print('Creating Senseday roadmap...')
    orchestrator.create_roadmap(APP_DESCRIPTION)

module = orchestrator.get_next_module()

if module is None:
    print('All modules completed!')
    print(orchestrator.get_progress())
else:
    print(f'Building: {module["name"]}')
    print(orchestrator.get_progress())
    idea = {'name': module['name'], 'description': module['description']}
    pipeline = SoftwareFactoryPipeline()
    result = pipeline.run(idea=idea)
    score = result.get('stages', {}).get('review', {}).get('score', 0)
    orchestrator.mark_done(module['module'], score)
    print(orchestrator.get_progress())
