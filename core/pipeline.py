from agents.decision_maker import DecisionMakerAgent
from agents.planner import PlannerAgent
from agents.architect import ArchitectAgent
from agents.developer import DeveloperAgent
from agents.reviewer import ReviewerAgent
from agents.devops import DevOpsAgent
from agents.analyst import AnalystAgent
from core.file_writer import write_app_to_disk, save_execution_history
from datetime import datetime

class SoftwareFactoryPipeline:

    def run(self):
        print("="*50)
        print("AI SOFTWARE FACTORY - PIPELINE START")
        print("="*50)
        result = {"started_at": datetime.now().isoformat(), "stages": {}}
        print("[1/7] Decision Maker...")
        idea = DecisionMakerAgent().choose_idea()
        result["stages"]["idea"] = idea
        result["app_name"] = idea["name"]
        print("[2/7] Planner...")
        plan = PlannerAgent().create_product_plan(idea)
        result["stages"]["plan"] = plan
        print("[3/7] Architect...")
        architecture = ArchitectAgent().design_architecture(plan)
        result["stages"]["architecture"] = architecture
        print("[4/7] Developer...")
        code = DeveloperAgent().generate_code(architecture)
        result["stages"]["code_generated"] = bool(code and "error" not in code)
        print("[5/7] Reviewer...")
        review = ReviewerAgent().review_code(code)
        result["stages"]["review"] = review
        print("[6/7] Writing files...")
        if review.get("status") in ["approved", "pending"]:
            app_path = write_app_to_disk(idea["name"], code)
            result["app_path"] = app_path
        else:
            result["app_path"] = None
        print("[7/7] DevOps...")
        deployment = DevOpsAgent().deploy_app(code)
        result["stages"]["deployment"] = deployment
        analysis = AnalystAgent().analyze_results(deployment)
        result["stages"]["analysis"] = analysis
        result["status"] = deployment.get("status", "unknown")
        result["finished_at"] = datetime.now().isoformat()
        save_execution_history(result)
        print("PIPELINE COMPLETE - App:", idea["name"])
        return result
