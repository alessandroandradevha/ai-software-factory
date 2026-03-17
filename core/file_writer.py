import os
import json
from datetime import datetime

def write_app_to_disk(app_name: str, code: dict) -> str:
    safe_name = app_name.lower().replace(" ", "-")
    base_path = f"apps/{safe_name}"
    os.makedirs(base_path, exist_ok=True)

    for folder, files in code.items():
        if isinstance(files, dict):
            for filename, content in files.items():
                file_path = os.path.join(base_path, folder, f"{filename}.ts")
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"  [Writer] Created: {file_path}")
        elif isinstance(files, str):
            file_path = os.path.join(base_path, f"{folder}.ts")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(files)

    return base_path

def save_execution_history(data: dict):
    os.makedirs("data", exist_ok=True)
    history_path = "data/history.json"

    history = []
    if os.path.exists(history_path):
        with open(history_path, "r") as f:
            history = json.load(f)

    entry = {
        "id": len(history) + 1,
        "timestamp": datetime.now().isoformat(),
        **data
    }

    history.append(entry)

    with open(history_path, "w") as f:
        json.dump(history, f, indent=2, ensure_ascii=False)

    print(f"[History] Saved execution #{entry['id']}")
    return entry
