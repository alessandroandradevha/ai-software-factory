import json
import os

def load_history():
    path = 'data/history.json'
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return json.load(f)

def get_learning_context():
    history = load_history()
    if not history:
        return 'No history yet.'
    summary = []
    for h in history[-5:]:
        app = h.get('app_name', 'unknown')
        score = h.get('stages', {}).get('review', {}).get('score', 0)
        status = h.get('status', 'unknown')
        summary.append('App: ' + app + ', Score: ' + str(score) + '/100, Status: ' + status)
    return 'Previous runs:\n' + '\n'.join(summary)
