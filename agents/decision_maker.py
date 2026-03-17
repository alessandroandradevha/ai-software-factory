from core.ai_client import ask_ai
import json

IDEA_POOL = [
    {"name": "AI Habit Tracker", "description": "Track habits with AI insights"},
    {"name": "Invoice Generator SaaS", "description": "Generate professional invoices with AI"},
    {"name": "AI Resume Builder", "description": "Build resumes with AI for job seekers"},
]

class DecisionMakerAgent:

    def score_idea(self, idea: dict) -> dict:
        prompt = f"""
Evaluate this SaaS app idea for commercial viability.

Idea: {idea['name']}
Description: {idea['description']}

Score each from 0 to 10:
- market_demand
- monetization_potential
- technical_feasibility
- competition (low competition = high score)
- time_to_market

Return ONLY a JSON:
{{
  "market_demand": 8,
  "monetization_potential": 9,
  "technical_feasibility": 7,
  "competition": 5,
  "time_to_market": 8,
  "total_score": 37,
  "reasoning": "brief reason"
}}
Return ONLY the JSON. No explanation. No markdown.
"""
        raw = ask_ai(prompt)
        try:
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            scores = json.loads(clean)
            scores["idea"] = idea
            return scores
        except:
            return {"idea": idea, "total_score": 0}

    def choose_idea(self) -> dict:
        print("[DecisionMaker] Scoring all ideas...")
        scored = []
        for idea in IDEA_POOL:
            result = self.score_idea(idea)
            print(f"  -> {idea['name']}: {result.get('total_score', 0)}/50")
            scored.append(result)

        scored.sort(key=lambda x: x.get("total_score", 0), reverse=True)
        best = scored[0]
        print(f"[DecisionMaker] Winner: {best['idea']['name']}")
        print(f"[DecisionMaker] Reason: {best.get('reasoning', '')}")
        return best["idea"]
