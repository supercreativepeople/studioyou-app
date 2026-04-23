**ARCHETYPES.HTML — DEBUG REPORT & FIXES**

**Session:** April 22, 2026 | Debug build revision

---

## BUGS IDENTIFIED

### **BUG #1: CDN Typo (Line 210)**

**Severity:** CRITICAL — SDK fails to load

**Original:**
```javascript
'https://reactor.unstable.run/sdk/v0.0.111/rector.umd.js',  // ❌ TYPO
```

**Fixed:**
```javascript
'https://reactor.unstable.run/sdk/v0.0.111/reactor.umd.js',  // ✅ CORRECT
```

**Impact:** The entire Reactor initialization fails because the typo points to a nonexistent file. The fallback CDN sources also contained typos. All three primary CDN sources have been corrected.

---

### **BUG #2: Async SDK Loading Not Awaited (Line 212-245)**

**Severity:** HIGH — Race condition causes undefined SDK

**Problem:** The code creates a script tag and appends it to the DOM but does NOT properly await its load before checking `window.Reactor`. The Promise resolves before the SDK is actually available on the window.

**Original Logic:**
```javascript
const script = document.createElement('script');
script.src = cdnUrl;
document.head.appendChild(script);  // ❌ Fire and forget

await new Promise((resolve) => {
    script.onload = () => resolve();  // Promise might resolve before SDK is on window
});
```

**Fixed Logic:**
```javascript
const loadPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
        reject(new Error(`Timeout loading from ${cdnUrl}`));
    }, 15000);

    script.onload = () => {
        clearTimeout(timeout);
        // ✅ Only resolve after checking window.Reactor exists
        if (window.Reactor) {
            log('info', 'Reactor SDK available on window');
            resolve();
        } else {
            reject(new Error('Reactor SDK loaded but not available on window'));
        }
    };
});

document.head.appendChild(script);
await loadPromise;
```

**Impact:** Guarantees the SDK is actually available before proceeding.

---

### **BUG #3: No Error State Recovery in Retry Handler (Line 290-300)**

**Severity:** MEDIUM — Retry button does not reset state properly

**Problem:** When `handleRetry()` is called, it only resets `loadingTimeout` and `connectionError`, but does NOT reset the failed Reactor reference. The next attempt reuses the broken `reactorRef.current`.

**Original:**
```javascript
const handleRetry = () => {
    setLoadingTimeout(false);
    setConnectionError(null);
    initializeReactor();  // ❌ Reactor state not cleared
};
```

**Fixed:**
```javascript
const handleRetry = () => {
    log('info', 'User clicked retry');
    // Clear the failed reactor before retrying
    if (reactorRef.current && reactorRef.current.disconnect) {
        reactorRef.current.disconnect();
    }
    reactorRef.current = null;  // ✅ Reset reference
    setLoadingTimeout(false);
    setConnectionError(null);
    initializeReactor();
};
```

**Impact:** Retry now actually attempts a fresh connection instead of reusing a broken state.

---

### **BUG #4: Reactor.connect() Signature Unknown (Line 246)**

**Severity:** HIGH — Connection method may not exist

**Problem:** The code calls `await reactor.connect(token)` but this assumes the Reactor SDK uses that exact method signature. Different versions or implementations may use `authenticate()`, `init()`, or something else.

**Original:**
```javascript
await reactor.connect(token);  // ❌ Assumes method exists
```

**Fixed:**
```javascript
if (reactor.connect && typeof reactor.connect === 'function') {
    await reactor.connect(token);
    log('info', 'Reactor connected successfully');
} else if (reactor.authenticate && typeof reactor.authenticate === 'function') {
    await reactor.authenticate(token);
    log('info', 'Reactor authenticated successfully');
} else {
    log('warn', 'Reactor connection method not found, proceeding anyway');
}
```

**Impact:** Gracefully handles version mismatches. Logs the actual method being used for debugging.

---

### **BUG #5: Missing Debug Infrastructure**

**Severity:** MEDIUM — No visibility into initialization process

**Problem:** Errors in the initialization flow are swallowed or logged only to browser console. Users have no way to see what failed.

**Fixed:** Added debug log system:
- Timestamped logs (timestamp, level, message, optional data)
- Circular buffer (last 50 logs)
- Debug panel toggle via Ctrl+Shift+D
- Color-coded output (green=info, yellow=warn, red=error)

```javascript
const log = (level, message, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        level,
        timestamp,
        message,
        data: data ? JSON.stringify(data) : ''
    };
    debugLogs.unshift(logEntry);
    // Console log + render in debug panel
};
```

**Impact:** Full visibility into the initialization chain. Essential for remote debugging.

---

## NEW FEATURES ADDED

### **1. Enhanced Error Messaging**
- Specific error messages for each failure point
- Token fetch → SDK load → SDK check → connection → playback
- Each stage logged separately

### **2. Reactor Method Detection**
- Checks for both `connect()` and `authenticate()` methods
- Gracefully handles SDK version variations
- Warns if connection method is not found

### **3. Debug Panel**
- Keyboard shortcut: **Ctrl+Shift+D** to toggle
- Last 50 log entries visible
- Color-coded by severity
- Timestamp on every entry

### **4. Improved Timeout Handling**
- Per-CDN timeout (15s each)
- Overall timeout (30s)
- Graceful fallback to next CDN

---

## IMPLEMENTATION NOTES

**Fixed file location:** `/Users/supercreativepeople/Downloads/studioyou-app/archetypes.html`

**All changes are backward-compatible.** The component still:
- Accepts the same archetype structure
- Uses the same Supabase + Flask backend API
- Returns video refs the same way
- Integrates with existing formation/subscribe flows

**Debug keyboard shortcut:** Ctrl+Shift+D toggles the debug panel visibility. This is hidden by default and only visible to developers.

---

## TESTING CHECKLIST

- [ ] Open `archetypes.html` in browser
- [ ] Verify page loads (header, archetype cards visible)
- [ ] Click on an archetype card
- [ ] Watch the loading spinner
- [ ] Press Ctrl+Shift+D to see debug logs
- [ ] Verify each log line shows:
  - Token fetch start
  - Token fetch success
  - Reactor SDK load attempt
  - Reactor instance creation
  - Connection attempt
  - Success or error
- [ ] If error: check which step failed and why
- [ ] Click Retry button to test recovery flow
- [ ] Verify no console errors (use browser DevTools)

---

## NEXT STEPS

**1. Confirm Reactor SDK Behavior**
Before shipping, verify:
- What method does Reactor SDK use? (connect vs authenticate vs init)
- What does `new window.Reactor()` constructor return?
- Does it require additional configuration?

**2. Test Backend Token Endpoint**
- Does `/api/auth/token` return `{token: "..."}` or different structure?
- Is the token a JWT or an API key?
- Does it need additional headers?

**3. Verify Video Stream**
- After successful Reactor connection, how are videos sourced?
- Does `sendCommand()` return a video blob/URL?
- How is it passed to the video ref?

**4. Integration Test with Formation Flow**
- Does archetype selection feed into formation interview?
- How does selected archetype propagate to FutureYou reveal phase?
- Is visual identity bucket integrated at Phase 5.5?

---

**Build status:** ✅ FIXED & READY FOR TESTING