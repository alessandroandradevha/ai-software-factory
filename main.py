from core.pipeline import SoftwareFactoryPipeline

# ============================================
# DEFINA SUA IDEIA AQUI ANTES DE RODAR
# ============================================
IDEA = {
    "name": "Invoice Generator SaaS",
    "description": "SaaS para gerar faturas profissionais com PDF export"
}
# ============================================

print("AI SOFTWARE FACTORY STARTING...")
print(f"Building: {IDEA[chr(110)+chr(97)+chr(109)+chr(101)]}")

pipeline = SoftwareFactoryPipeline()
result = pipeline.run(idea=IDEA)

print("FACTORY FINISHED")
print("STATUS:", result["status"])
