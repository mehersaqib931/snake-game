/**
 * input.js — Input Handler
 * Responsibilities:
 *   - Listen for arrow key presses
 *   - Fire onDirection callback with direction string
 *   - Listen for P / Escape and fire onPause callback
 *   - Prevent default scroll behaviour on arrow keys
 *   - Provide clean destroy() for event listener teardown
 *
 * Does NOT: know about snake, game state, or drawing
 */

// ── Arrow key → direction string map ──────────────────────────────
const KEY_MAP = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

// ── Keys that should prevent default browser behaviour ────────────
const PREVENT_DEFAULT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

// ── Pause keys ────────────────────────────────────────────────────
const PAUSE_KEYS = new Set(["p", "P", "Escape"]);

export class InputHandler {
  /**
   * @param {function(string): void} onDirection - called with 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
   * @param {function(): void}       onPause     - called when P or Escape pressed
   */
  constructor(onDirection, onPause) {
    this._onDirection = onDirection;
    this._onPause = onPause;

    // Bind handler so we can remove the exact same reference later
    this._handleKeyDown = this._handleKeyDown.bind(this);

    // Register listener
    window.addEventListener("keydown", this._handleKeyDown);
  }

  // ── Handle keydown event ─────────────────────────────────────────
  _handleKeyDown(event) {
    const { key, repeat } = event;

    // Ignore key repeat events (held down key)
    if (repeat) return;

    // Prevent page scroll on arrow keys
    if (PREVENT_DEFAULT_KEYS.has(key)) {
      event.preventDefault();
    }

    // Direction keys
    if (KEY_MAP[key]) {
      this._onDirection(KEY_MAP[key]);
      return;
    }

    // Pause keys
    if (PAUSE_KEYS.has(key)) {
      this._onPause();
    }
  }

  // ── Remove event listener — call on game over or unmount ─────────
  destroy() {
    window.removeEventListener("keydown", this._handleKeyDown);
  }
}
