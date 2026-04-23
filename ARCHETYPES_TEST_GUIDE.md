**ARCHETYPES.HTML — TESTING & DEBUG GUIDE**

**Status:** ✅ BUILT & READY FOR TESTING

**File Location:** `/Users/supercreativepeople/Downloads/studioyou-app/archetypes.html`

**File Size:** 575 lines | Valid React + HTML

---

## QUICK START

### **Step 1: Open in Browser**
```
file:///Users/supercreativepeople/Downloads/studioyou-app/archetypes.html
```

### **Step 2: What You Should See**
- Purple gradient header "Creator Studio Archetypes"
- 5 archetype cards in a grid:
  - Documentary
  - Social Creator
  - YouTube Creator
  - Podcast Host
  - Multi-Format Studio
- Dark video container at top
- CTA section "Ready to Create?" at bottom
- "Show Debug" button in bottom right

### **Step 3: Enable Debug Panel**
Click "Show Debug" button or press **Ctrl+Shift+D**

You should see logs appearing like:
```
02:41:30 [INFO] App mounted
02:41:30 [INFO] Component mounted, initializing Reactor
02:41:30 [INFO] Starting Reactor initialization
02:41:30 [INFO] Fetching token from https://studioyou-api-198959034459...
```

### **Step 4: Test Archetype Selection**
Click on any archetype card (e.g., "Documentary")

Expected behavior:
1. Card highlights with blue border
2. Loading spinner appears in video container
3. Debug logs show:
   ```
   [INFO] Archetype selected { archetypeId: 'documentary' }
   [INFO] Loading archetype { archetypeId: 'documentary' }
   ```
4. After 1 second, video container shows "🎬 DOCUMENTARY"

---

## DEBUG PANEL INTERPRETATION

### **Success Flow**
```
[INFO] App mounted
[INFO] Component mounted, initializing Reactor
[INFO] Starting Reactor initialization
[INFO] Fetching token from https://studioyou-api-198959034459.us-east1.run.app/api/auth/token
[INFO] Token fetched successfully { tokenLength: 456 }
[INFO] Checking for Reactor SDK
[WARN] Reactor SDK not found in window
[INFO] Archetype selected { archetypeId: 'documentary' }
[INFO] Loading archetype { archetypeId: 'documentary' }
[INFO] Archetype loaded (demo)
```

This is EXPECTED if Reactor SDK isn't loaded. The page degrades gracefully to demo mode.

### **Expected Error Flow (First Run)**
```
[ERROR] Token fetch failed Error: HTTP 403: Forbidden
[ERROR] Auth failed: HTTP 403: Forbidden
```

This is NORMAL. The backend requires proper authentication credentials, which won't be sent from a file:// URL.

### **Critical Errors (Would Require Fix)**
```
[ERROR] Reactor init failed ReferenceError: React is not defined
```
This would mean React didn't load. Check network tab in DevTools.

```
[ERROR] Failed to load archetype TypeError: videoRef is null
```
This would mean the DOM didn't render properly.

---

## VERIFICATION CHECKLIST

### **UI Rendering**
- [ ] Page loads without JavaScript errors
- [ ] Header displays correctly (purple gradient, white text)
- [ ] 5 archetype cards visible in grid
- [ ] Each card shows name + description
- [ ] CTA section visible at bottom
- [ ] "Show Debug" button visible in bottom-right

### **Interactivity**
- [ ] Clicking archetype card highlights it (blue border)
- [ ] Video container shows placeholder text
- [ ] Loading spinner appears briefly (1 second)
- [ ] Placeholder message appears after load

### **Debug System**
- [ ] "Show Debug" button toggles panel visibility
- [ ] Debug panel shows logs with timestamps
- [ ] Logs show correct sequence:
  1. App mounting
  2. Reactor initialization
  3. Token fetch attempt
  4. Archetype selection
  5. Archetype load

### **Responsive Design**
- [ ] Resize browser window to < 768px
- [ ] Grid collapses to single column
- [ ] All text remains readable
- [ ] Buttons remain clickable

---

## KNOWN BEHAVIOR

### **Demo Mode (When Backend Unavailable)**
If authentication fails, the page enters "demo mode":
- UI fully functional
- Archetype selection works
- No actual Reactor SDK calls
- Placeholder video/message shown
- This is EXPECTED and CORRECT

### **Reactor SDK Loading**
The page tries to load Reactor SDK from three CDN sources in order:
1. `https://reactor.unstable.run/sdk/v0.0.111/reactor.umd.js`
2. `https://cdn.jsdelivr.net/npm/reactor@0.0.111/dist/reactor.umd.js`
3. `https://unpkg.com/reactor@0.0.111/dist/reactor.umd.js`

If all fail, this is logged but doesn't break the UI.

### **Token Authentication**
The page attempts to fetch a token from:
```
https://studioyou-api-198959034459.us-east1.run.app/api/auth/token
```

If this fails (403, 404, etc.), it's logged and the page degrades gracefully.

---

## DEBUGGING TIPS

### **If Page Doesn't Load at All**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Common issues:
   - React CDN blocked (network error)
   - Babel standalone not loading
   - Browser cache issue (hard refresh: Cmd+Shift+R)

### **If Cards Don't Respond to Clicks**
1. Open DevTools Console
2. Type: `document.querySelectorAll('.archetype-card').length`
3. Should return: `5`
4. If different, React didn't render properly

### **If Debug Panel Doesn't Show**
1. Check that "Show Debug" button is visible
2. Try keyboard shortcut: Ctrl+Shift+D
3. If nothing happens, React might not be running
4. Check Console for errors

### **To Inspect Component State**
In DevTools Console:
```javascript
// Check if React root is mounted
document.getElementById('root')

// Check if page has token
localStorage.getItem('sy_email')
```

---

## NEXT STEPS

### **Once archetypes.html is Confirmed Working:**

1. **Wire to Formation Interview**
   - Selected archetype should persist in localStorage
   - Formation should reference the archetype type
   - FutureYou reveal should use archetype as context

2. **Integrate Selfie Capture**
   - Phase 5.5 visual identity collection
   - Archetype selection informs the photography prompts
   - Visual bucket tied to archetype

3. **Connect FutureYou Reveal**
   - Archetype + formation data + visual bucket
   - Generate personalized prompt
   - Animate user into their studio world

4. **Test Reactor SDK Integration**
   - If Reactor SDK is available, test video generation
   - If not, determine fallback strategy
   - Test error recovery and retry flow

---

## SUPPORT

If you see errors not listed here:

1. **Copy all debug logs** (select all in debug panel, Cmd+C)
2. **Note the exact error message** from the error message box
3. **Check browser console** (F12 > Console tab) for any red errors
4. **Provide the debug output** for analysis

---

**File Status:** ✅ Ready for browser testing

**Next Action:** Open the file in your browser and run through the verification checklist above.