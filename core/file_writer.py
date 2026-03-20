import os
import json
from datetime import datetime

def clean_filename(filename):
    for ext in ['.tsx', '.ts', '.jsx', '.js']:
        if filename.endswith(ext):
            filename = filename[:-len(ext)]
    return filename

def get_extension(folder, filename):
    if filename.startswith('.env') or filename.startswith('.'):
        return ''
    if folder in ['pages', 'components', 'app']:
        return '.tsx'
    if folder == 'root':
        return ''
    return '.ts'

def write_app_to_disk(app_name, code, base_dir='apps'):
    safe_name = app_name.lower().replace(' ', '-').replace('/', '-').replace('&', 'and')
    base_path = os.path.join(base_dir, safe_name)
    os.makedirs(base_path, exist_ok=True)
    for folder, files in code.items():
        if isinstance(files, dict):
            for filename, content in files.items():
                clean = clean_filename(filename)
                ext = get_extension(folder, clean)
                if folder == 'root':
                    file_path = os.path.join(base_path, f'{clean}{ext}')
                else:
                    file_path = os.path.join(base_path, folder, f'{clean}{ext}')
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, 'w', encoding='utf-8') as wf:
                    wf.write(str(content))
                print(f'  [Writer] Created: {file_path}')
        elif isinstance(files, str):
            clean = clean_filename(folder)
            file_path = os.path.join(base_path, f'{clean}.ts')
            with open(file_path, 'w', encoding='utf-8') as wf:
                wf.write(files)
    return base_path

def write_to_project(code, project_path):
    for folder, files in code.items():
        if isinstance(files, dict):
            for filename, content in files.items():
                clean = clean_filename(filename)
                ext = get_extension(folder, clean)
                if folder == 'root':
                    file_path = os.path.join(project_path, f'{clean}{ext}')
                else:
                    file_path = os.path.join(project_path, folder, f'{clean}{ext}')
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                with open(file_path, 'w', encoding='utf-8') as wf:
                    wf.write(str(content))
                print(f'  [Writer] Created: {file_path}')

def save_execution_history(data):
    os.makedirs('data', exist_ok=True)
    history_path = 'data/history.json'
    history = []
    if os.path.exists(history_path):
        with open(history_path) as hf:
            history = json.load(hf)
    entry = {'id': len(history) + 1, 'timestamp': datetime.now().isoformat(), **data}
    history.append(entry)
    with open(history_path, 'w') as hf:
        json.dump(history, hf, indent=2, ensure_ascii=False)
    print(f'[History] Saved execution #{entry[chr(105)+chr(100)]}')
    return entry
