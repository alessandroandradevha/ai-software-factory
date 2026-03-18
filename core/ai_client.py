import os
import time
from groq import Groq
from dotenv import load_dotenv
import urllib.request
import json

load_dotenv()

GROQ_KEY = os.getenv('GROQ_API_KEY')
OPENROUTER_KEY = os.getenv('OPENROUTER_API_KEY')

def ask_ai_groq(prompt, system):
    client = Groq(api_key=GROQ_KEY)
    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'system', 'content': system}, {'role': 'user', 'content': prompt}],
        temperature=0.3,
        max_tokens=2000
    )
    return response.choices[0].message.content

def ask_ai_openrouter(prompt, system, retry=2):
    data = json.dumps({
        'model': 'nvidia/nemotron-3-super-120b-a12b:free',
        'messages': [{'role': 'system', 'content': system}, {'role': 'user', 'content': prompt}],
        'max_tokens': 2000
    }).encode()
    req = urllib.request.Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=data,
        headers={
            'Authorization': f'Bearer {OPENROUTER_KEY}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/alessandroandradevha/ai-software-factory'
        }
    )
    for attempt in range(retry):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read())
                return result['choices'][0]['message']['content']
        except Exception as e:
            if attempt < retry - 1:
                print(f'[AI] OpenRouter retry {attempt+1}...')
                time.sleep(10)
            else:
                raise e

def ask_ai(prompt, system='You are a senior software engineer.'):
    # Tenta Groq primeiro
    if GROQ_KEY:
        try:
            print('[AI] Using Groq...')
            return ask_ai_groq(prompt, system)
        except Exception as e:
            print(f'[AI] Groq failed: {e}')
            print('[AI] Switching to OpenRouter...')
    # Fallback OpenRouter
    if OPENROUTER_KEY:
        try:
            print('[AI] Using OpenRouter/DeepSeek...')
            return ask_ai_openrouter(prompt, system)
        except Exception as e:
            print(f'[AI] OpenRouter failed: {e}')
    raise Exception('All AI providers failed. Check API keys.')
