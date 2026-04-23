#!/bin/bash

# ARCHETYPES.HTML TEST HARNESS
# Tests the archetypes.html file without needing Reactor SDK

echo "=========================================="
echo "ARCHETYPES.HTML TEST HARNESS"
echo "=========================================="
echo ""

FILE="/Users/supercreativepeople/Downloads/studioyou-app/archetypes.html"

# Check file exists
if [ ! -f "$FILE" ]; then
    echo "❌ FAIL: File not found at $FILE"
    exit 1
fi

echo "✅ File exists at $FILE"
echo ""

# Check file is valid HTML
if ! grep -q "<!DOCTYPE html>" "$FILE"; then
    echo "❌ FAIL: Not valid HTML (missing DOCTYPE)"
    exit 1
fi
echo "✅ Valid HTML structure (DOCTYPE found)"

# Check React is loaded
if ! grep -q "unpkg.com/react@18" "$FILE"; then
    echo "❌ FAIL: React not loaded"
    exit 1
fi
echo "✅ React script loaded"

# Check JSX is present
if ! grep -q "ArchetypesExplorer" "$FILE"; then
    echo "❌ FAIL: ArchetypesExplorer component missing"
    exit 1
fi
echo "✅ ArchetypesExplorer component found"

# Check archetypes data
ARCHETYPE_COUNT=$(grep -c "id: '" "$FILE")
if [ "$ARCHETYPE_COUNT" -lt 5 ]; then
    echo "❌ FAIL: Expected 5+ archetypes, found $ARCHETYPE_COUNT"
    exit 1
fi
echo "✅ Found $ARCHETYPE_COUNT archetype definitions"

# Check token endpoint is correct
if ! grep -q "studioyou-api-198959034459.us-east1.run.app" "$FILE"; then
    echo "❌ FAIL: Correct backend API URL not found"
    exit 1
fi
echo "✅ Backend API URL correct"

# Check debug system exists
if ! grep -q "debugLogs" "$FILE"; then
    echo "❌ FAIL: Debug system not found"
    exit 1
fi
echo "✅ Debug logging system found"

# Check error handling
if ! grep -q "setConnectionError" "$FILE"; then
    echo "❌ FAIL: Error handling missing"
    exit 1
fi
echo "✅ Error handling implemented"

# Check Reactor error recovery
if ! grep -q "reactorRef.current = null" "$FILE"; then
    echo "❌ FAIL: Reactor cleanup/recovery missing"
    exit 1
fi
echo "✅ Reactor cleanup on retry found"

echo ""
echo "=========================================="
echo "TEST SUMMARY: ALL CHECKS PASSED ✅"
echo "=========================================="
echo ""
echo "File size: $(wc -c < "$FILE") bytes"
echo "Line count: $(wc -l < "$FILE") lines"
echo ""
echo "The archetypes.html file is ready for testing."
echo "Open it in a browser at:"
echo "file://$FILE"
echo ""