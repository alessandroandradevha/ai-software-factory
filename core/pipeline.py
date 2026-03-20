from agents.planner import PlannerAgent
from agents.architect import ArchitectAgent
from agents.developer import DeveloperAgent
from agents.reviewer import ReviewerAgent
from agents.fixer import FixerAgent
from agents.devops import DevOpsAgent
from agents.integrator import IntegratorAgent
from agents.analyst import AnalystAgent
from core.file_writer import write_app_to_disk, save_execution_history
from core.learning import load_history
from datetime import datetime

class SoftwareFactoryPipeline:

    def run(self, idea: dict) -> dict:
        print("=" * 50)
        print("AI SOFTWARE FACTORY - PIPELINE START")
        print(f"App: {idea[chr(110)+chr(97)+chr(109)+chr(101)]}")
        print("=" * 50)

        result = {"started_at": datetime.now().isoformat(), "stages": {}, "app_name": idea["name"]}

        print("[1/6] Planner...")
        plan = PlannerAgent().create_product_plan(idea)
        result["stages"]["plan"] = plan

        print("[2/6] Architect...")
        architecture = ArchitectAgent().design_architecture(plan)
        result["stages"]["architecture"] = architecture

        print("[3/6] Developer...")
        code = DeveloperAgent().generate_code(architecture)

        print("[4/6] Review + Fix loop (max 3 attempts)...")
        fixer = FixerAgent()
        reviewer = ReviewerAgent()
        best_code = code
        best_score = 0
        best_snapshot = code

        for attempt in range(1, 4):
            review = reviewer.review_code(best_code)
            score = review.get("score", 0)
            issues = review.get("issues", [])
            print(f"  Attempt {attempt}/3 - Score: {score}/100 - Issues: {len(issues)}")

            if score > best_score:
                best_score = score
                best_snapshot = best_code

            if score >= 80 or not issues:
                print(f"  Code approved on attempt {attempt}")
                break

            if attempt < 3:
                fixed = fixer.fix_code(best_code, issues, attempt)
                if fixed and fixed != best_code:
                    best_code = fixed

        best_code = best_snapshot

        result["stages"]["review"] = {"score": best_score, "attempts": attempt}
        result["stages"]["code_generated"] = True

        print("[5/6] Writing files...")
        app_path = write_app_to_disk(idea["name"], best_code)
        result["app_path"] = app_path

        print("[6/6] DevOps...")
        deployment = DevOpsAgent().deploy_app(best_code)
        analysis = AnalystAgent().analyze_results(deployment)
        result["stages"]["deployment"] = deployment
        result["stages"]["analysis"] = analysis
        result["status"] = deployment.get("status", "unknown")
        result["finished_at"] = datetime.now().isoformat()

        # Integrator analisa e gera relatório
        print("[7/7] Integrator analyzing...")
        integrator = IntegratorAgent()
        report = integrator.analyze(idea["name"], best_code)
        integrator.save_report(report)
        result["integration_report"] = report

        save_execution_history(result)
        print("=" * 50)
        print(f"DONE - Score: {best_score}/100 - App: {idea[chr(110)+chr(97)+chr(109)+chr(101)]}")
        print(f"New files: {len(report[chr(110)+chr(101)+chr(119)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])} | Files to modify: {len(report[chr(109)+chr(111)+chr(100)+chr(105)+chr(102)+chr(105)+chr(101)+chr(100)+chr(95)+chr(102)+chr(105)+chr(108)+chr(101)+chr(115)])}")
        print("=" * 50)
        return result
