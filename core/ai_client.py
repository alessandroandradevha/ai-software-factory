import os
import time
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_KEY = os.getenv('ANTHROPIC_API_KEY')
GROQ_KEY = os.getenv('GROQ_API_KEY')
OPENROUTER_KEY = os.getenv('OPENROUTER_API_KEY')

def ask_ai_claude(prompt, system):
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    message = client.messages.create(
        model='claude-haiku-4-5',
        max_tokens=2000,
        system=system,
        messages=[{'role': 'user', 'content': prompt}]
    )
    return message.content[0].text

def ask_ai_groq(prompt, system):
    from groq import Groq
    client = Groq(api_key=GROQ_KEY)
    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'system', 'content': system}, {'role': 'user', 'content': prompt}],
        temperature=0.3,
        max_tokens=2000
    )
    return response.choices[0].message.content

def ask_ai_openrouter(prompt, system):
    data = json.dumps({
        'model': 'nvidia/nemotron-3-super-120b-a12b:free',
        'messages': [{'role': 'system', 'content': system}, {'role': 'user', 'content': prompt}],
        'max_tokens': 2000
    }).encode()
    req = urllib.request.Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=data,
        headers={'Authorization': f'Bearer {OPENROUTER_KEY}', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read())
        return result['choices'][0]['message']['content']

def ask_ai(prompt, system='You are a senior software engineer.'):
    if ANTHROPIC_KEY:
        try:
            print('[AI] Using Claude Haiku...')
            return ask_ai_claude(prompt, system)
        except Exception as e:
            print(f'[AI] Claude failed: {e}')
    if GROQ_KEY:
        try:
            print('[AI] Using Groq...')
            return ask_ai_groq(prompt, system)
        except Exception as e:
            print(f'[AI] Groq failed: {e}')
    if OPENROUTER_KEY:
        try:
            print('[AI] Using OpenRouter...')
            return ask_ai_openrouter(prompt, system)
        except Exception as e:
            print(f'[AI] OpenRouter failed: {e}')
    raise Exception('All AI providers failed.')
