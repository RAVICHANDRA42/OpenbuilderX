import urllib.request
import json
import sys
sys.path.insert(0, '.')
from api.middleware.auth import create_access_token

token = create_access_token('test-user')
body = json.dumps({"prompt": "a red apple on a wooden table", "style": "realistic", "size": "512x512"}).encode()

req = urllib.request.Request(
    'http://localhost:8000/api/images/generate',
    data=body,
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'},
    method='POST'
)
try:
    resp = urllib.request.urlopen(req, timeout=300)
    print('Status:', resp.status)
    print('Body:', resp.read().decode())
except urllib.error.HTTPError as e:
    print('Error status:', e.code)
    print('Error body:', e.read().decode())
except Exception as e:
    print('Exception:', type(e).__name__, e)
