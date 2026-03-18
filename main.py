from core.pipeline import SoftwareFactoryPipeline
from agents.orchestrator import OrchestratorAgent
import os

# ============================================
# DEFINA SEU APP AQUI (apenas na primeira vez)
# Depois o Orchestrator avanca automaticamente
# ============================================
APP_DESCRIPTION = """
Invoice Generator SaaS para freelancers.
Funcionalidades: dashboard, clientes, faturas, export PDF.
Tech: Next.js 14, Tailwind, Supabase, TypeScript.
"""
# ============================================

orchestrator = OrchestratorAgent()

# Cria roadmap se nao existir
if not os.path.exists('data/roadmap.json'):
    print('Creating roadmap for the first time...')
    orchestrator.create_roadmap(APP_DESCRIPTION)

# Pega proximo modulo pendente
module = orchestrator.get_next_module()

if module is None:
    print('All modules completed! App is ready.')
    print(orchestrator.get_progress())
else:
    print(f'Building module {module[chr(109)+chr(111)+chr(100)+chr(117)+chr(108)+chr(101)]}: {module[chr(110)+chr(97)+chr(109)+chr(101)]}')
    print(orchestrator.get_progress())

    idea = {
        'name': module['name'],
        'description': module['description']
    }

    pipeline = SoftwareFactoryPipeline()
    result = pipeline.run(idea=idea)

    # Marca modulo como concluido
    score = result.get('stages', {}).get('review', {}).get('score', 0)
    orchestrator.mark_done(module['module'], score)

    print('DONE')
    print(orchestrator.get_progress())
