# REACTOR/HELIOS ARCHITECTURE REVIEW & DIAGNOSTIC

## THE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (Frontend)                                          │
│  archetypes.html                                             │
│                                                              │
│  Step 1: POST /api/reactor/token                           │
│          → {email: "test@studioyou.app"}                   │
│          ← {token: "JWT_or_API_KEY"}                       │
│          ↓                                                  │
│  Step 2: Load SDK from reactor.unstable.run                │
│          ← window.Reactor available                        │
│          ↓                                                  │
│  Step 3: new window.Reactor({apiKey: token})               │
│          reactor.connect() or reactor.authenticate()        │
│          ↓                                                  │
│  Step 4: reactor.sendCommand({type: 'world_build', ...})   │
│          ← {videoUrl: "...", duration: 45, ...}            │
│          ↓                                                  │
│  RESULT: <video src={videoUrl} /> plays 45s cinematic      │
└─────────────────────────────────────────────────────────────┘
           ↓              ↓              ↓              ↓
```

## CURRENT FAILURE POINT

**Step 1 is failing with 503 Service Unavailable**

```
POST https://studioyou-api-198959034459.us-east1.run.app/api/reactor/token
↓
Status: 503 Service Unavailable
↓
PIPELINE STOPS
```

## THE BACKEND REQUIREMENTS

Your Flask backend on Cloud Run (`neat-tangent-474222-m9` project, `us-east1` region) needs:

### **Endpoint: POST /api/reactor/token**

```python
@app.route('/api/reactor/token', methods=['POST'])
def get_reactor_token():
    """
    Exchange StudioYou user email for a Reactor API token
    
    Backend is responsible for:
    1. Authenticating with Reactor/Helios API using SECRET_REACTOR_API_KEY
    2. Generating or fetching a token for this user
    3. Returning token to frontend
    """
    try:
        data = request.json
        email = data.get('email')
        
        # SECRET_REACTOR_API_KEY should be stored as GCP Cloud Run env var
        reactor_api_key = os.environ.get('REACTOR_API_KEY')
        
        if not reactor_api_key:
            return {'error': 'Reactor API key not configured'}, 500
        
        # Call Reactor API to get user token
        # THIS IS THE SECRET PART - backend handles auth
        token = authenticate_with_reactor(email, reactor_api_key)
        
        return {
            'token': token,
            'email': email,
            'timestamp': datetime.now().isoformat()
        }
    except Exception as e:
        return {'error': str(e)}, 500
```

## WHY THE BACKEND IS NEEDED

**The backend proxies authentication because:**

1. **API Key Security** — The Reactor/Helios API key cannot be exposed to the browser
   - It must stay server-side only
   - Browser only gets a temporary token

2. **User Association** — The backend links creator email to their Reactor resources
   - Creates/retrieves user account in Reactor
   - Manages permissions and quotas

3. **Token Generation** — The backend issues time-limited tokens
   - Frontend never sees the master API key
   - Tokens can be revoked/rotated server-side

## DIAGNOSTIC CHECKLIST

### **Is the Cloud Run service running?**
```bash
gcloud run services list --project=neat-tangent-474222-m9
gcloud run services describe studioyou-api --project=neat-tangent-474222-m9
```

### **Is the /api/reactor/token endpoint implemented?**
Check your Flask backend code:
- Does the endpoint exist?
- Is it POST or GET?
- Does it expect {email} in body?
- Does it return {token}?

### **Is the REACTOR_API_KEY environment variable set?**
```bash
gcloud run services describe studioyou-api --project=neat-tangent-474222-m9 --format='value(spec.template.spec.containers[0].env)'
```

Should show something like:
```
REACTOR_API_KEY=sk_reactor_xxxxx...
```

### **Is the backend code deployed?**
Check the Cloud Run deployment source:
- Source code repo
- Last deployment timestamp
- Build logs for errors

## NEXT STEPS

**Option 1: Fix the Backend (Recommended)**
1. Check backend source code
2. Verify /api/reactor/token is implemented
3. Check REACTOR_API_KEY is set in GCP
4. Redeploy if needed
5. Test again

**Option 2: Verify Backend is Running**
1. SSH into Cloud Run instance or check logs
2. See what error is actually happening (not just 503)
3. Fix the root cause
4. Restart service if needed

**Option 3: Get the Reactor API Key**
If you have direct access to Reactor API, you could potentially:
1. Skip the backend token step
2. Use the API key directly in frontend (NOT RECOMMENDED - security risk)
3. At least test if Reactor SDK works

---

**Your move:** Check the backend status and /api/reactor/token implementation. Report back what you find.
