/* ═══════════════════════════════════════════════════════════════
   sy-3d.js  —  StudioYou 3D Interactive Effects
   Version 1.0

   USAGE
   ─────
   Add to the bottom of <body> on any page that uses sy-3d.css:
     <script src="sy-3d.js" defer></script>

   To re-initialise after dynamically inserting new cards or toggles:
     SY3D.init();

   WHAT THIS FILE DOES
   ───────────────────
   1. Perspective card tilt   — .sy-card-3d-wrap > .sy-card-3d
   2. Toggle click handler    — .sy-toggle-3d  (.is-on toggled on click)
   3. (Optional) Prism button tilt — .sy-btn-prism-wrap > .sy-btn-prism

   All effects are skipped on touch-only devices (pointer: coarse)
   so mobile users see clean static states, not broken interactions.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Configuration ─────────────────────────────────────────── */
  var CONFIG = {
    card: {
      tiltMax:    16,          /* max degrees of tilt (each axis) */
      perspective: 950,        /* px — matches CSS */
      easeIn:  'transform 100ms linear, box-shadow 100ms linear',
      easeOut: 'transform 650ms cubic-bezier(0.16,1,0.3,1), box-shadow 650ms cubic-bezier(0.16,1,0.3,1)',
    },
    prism: {
      tiltX:   22,             /* max degrees horizontal tilt */
      tiltY:   14,             /* max degrees vertical tilt */
      easeIn:  'transform 80ms linear',
      easeOut: 'transform 550ms cubic-bezier(0.16,1,0.3,1)',
    },
  };

  /* ── Detect touch-primary devices ──────────────────────────── */
  /* Tilt effects require hover (pointer: fine). On touch screens  */
  /* we skip binding so cards remain flat and performant.          */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── 1. PERSPECTIVE CARD TILT ───────────────────────────────
     Finds every .sy-card-3d-wrap and binds mousemove / mouseleave.
     The specular shine child (.sy-card-3d-shine) has its radial
     gradient origin updated to follow the cursor.
     ─────────────────────────────────────────────────────────── */

  function bindCards() {
    document.querySelectorAll('.sy-card-3d-wrap').forEach(function (wrap) {
      /* Skip already-bound wrappers (safe to call init() multiple times) */
      if (wrap._sy3dBound) return;
      wrap._sy3dBound = true;

      var card  = wrap.querySelector('.sy-card-3d');
      var shine = card && card.querySelector('.sy-card-3d-shine');
      if (!card) return;

      if (!canHover) return; /* touch device — leave card flat */

      var cfg = CONFIG.card;

      function onMove(e) {
        var r = wrap.getBoundingClientRect();
        /* Normalise cursor to [-0.5, 0.5] within the wrapper */
        var nx = (e.clientX - r.left)  / r.width  - 0.5;
        var ny = (e.clientY - r.top)   / r.height - 0.5;

        card.style.transform = [
          'perspective(' + cfg.perspective + 'px)',
          'rotateY(' + (nx * cfg.tiltMax * 2) + 'deg)',
          'rotateX(' + (-ny * cfg.tiltMax)    + 'deg)',
        ].join(' ');
        card.style.transition = cfg.easeIn;

        /* Move specular highlight to follow cursor */
        if (shine) {
          var px = ((nx + 0.5) * 100).toFixed(1) + '%';
          var py = ((ny + 0.5) * 100).toFixed(1) + '%';
          shine.style.background =
            'radial-gradient(ellipse at ' + px + ' ' + py +
            ', rgba(255,255,255,0.075), transparent 68%)';
          shine.style.opacity = '1';
        }
      }

      function onLeave() {
        card.style.transform = [
          'perspective(' + cfg.perspective + 'px)',
          'rotateY(0deg)',
          'rotateX(0deg)',
        ].join(' ');
        card.style.transition = cfg.easeOut;
        if (shine) shine.style.opacity = '0';
      }

      wrap.addEventListener('mousemove',  onMove);
      wrap.addEventListener('mouseleave', onLeave);
    });
  }


  /* ── 2. TOGGLE CLICK HANDLER ────────────────────────────────
     Toggles .is-on on .sy-toggle-3d when clicked.
     Does NOT fire if the toggle is inside a <form> with a real
     <input type="checkbox"> — in that case, manage .is-on state
     yourself in the checkbox change handler.
     ─────────────────────────────────────────────────────────── */

  function bindToggles() {
    document.querySelectorAll('.sy-toggle-3d').forEach(function (toggle) {
      if (toggle._sy3dBound) return;
      toggle._sy3dBound = true;

      toggle.addEventListener('click', function (e) {
        /* If there's a real checkbox inside, let it drive state */
        var cb = toggle.querySelector('input[type="checkbox"]');
        if (cb) {
          /* Sync .is-on with checkbox checked state after the click */
          requestAnimationFrame(function () {
            toggle.classList.toggle('is-on', cb.checked);
          });
          return;
        }
        /* Standalone toggle (no checkbox) — flip directly */
        toggle.classList.toggle('is-on');
      });
    });
  }


  /* ── 3. PRISM BUTTON TILT (optional) ────────────────────────
     Only activates if .sy-btn-prism-wrap elements exist.
     Structure: .sy-btn-prism-wrap > button.sy-btn-prism
     The button must have perspective: set on the wrapper in CSS
     (or inline). Uses preserve-3d so the sheen children move too.
     ─────────────────────────────────────────────────────────── */

  function bindPrism() {
    document.querySelectorAll('.sy-btn-prism-wrap').forEach(function (wrap) {
      if (wrap._sy3dBound) return;
      wrap._sy3dBound = true;

      var btn = wrap.querySelector('.sy-btn-prism');
      if (!btn || !canHover) return;

      var cfg = CONFIG.prism;

      function onMove(e) {
        var r = wrap.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width  - 0.5;
        var ny = (e.clientY - r.top)  / r.height - 0.5;
        btn.style.transform =
          'rotateY(' + (nx * cfg.tiltX * 2) + 'deg) ' +
          'rotateX(' + (-ny * cfg.tiltY)    + 'deg) ' +
          'scale(1.03)';
        btn.style.transition = cfg.easeIn;
      }

      function onLeave() {
        btn.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
        btn.style.transition = cfg.easeOut;
      }

      wrap.addEventListener('mousemove',  onMove);
      wrap.addEventListener('mouseleave', onLeave);
    });
  }


  /* ── Public API ─────────────────────────────────────────────
     Call SY3D.init() after dynamically inserting new elements.
     ─────────────────────────────────────────────────────────── */

  var SY3D = {
    init: function () {
      bindCards();
      bindToggles();
      bindPrism();
    },
    config: CONFIG,
  };

  /* Auto-initialise */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { SY3D.init(); });
  } else {
    SY3D.init();
  }

  window.SY3D = SY3D;

}());
