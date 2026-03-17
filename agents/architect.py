class ArchitectAgent:

    def design_architecture(self, plan):

        architecture = {
            "frontend": "Next.js",
            "backend": "Node API",
            "database": "Supabase",
            "features": plan["features"]
        }

        return architecture
