/**
 * pause.js — Pause Screen
 * Responsibilities:
 *   - Render HTML overlay when game is paused
 *   - Fire onResume() when player clicks Resume or presses P
 *   - Fade in/out smoothly via CSS transition
 *
 * Does NOT: manage game state, draw on canvas, handle game logic
 */

export class PauseScreen {
  /**
   * @param {HTMLElement}     container - parent element (game-wrapper)
   * @param {function():void} onResume  - called when player resumes
   * @param {function():void} onQuit    - called when player quits to stage select
   */
  constructor(container, onResume, onQuit) {
    this._onResume = onResume;
    this._onQuit = onQuit;
    this._el = this._createElement();
    container.appendChild(this._el);
    this._bindEvents();
  }

  // ── Build overlay DOM ─────────────────────────────────────────────
  _createElement() {
    const el = document.createElement("div");
    el.className = "screen-overlay";
    el.id = "screen-pause";
    el.innerHTML = `
      <div class="screen-box">
        <div class="screen-title">Paused</div>
        <div class="screen-subtitle">Take a breather 🌿</div>

        <div class="screen-actions">
          <button class="btn-primary" id="pause-resume">Resume</button>
          <button class="btn-secondary" id="pause-quit">Quit to Stage Select</button>
        </div>

        <div class="screen-hint">Press <kbd>P</kbd> or <kbd>Esc</kbd> to resume</div>
      </div>
    `;
    return el;
  }

  // ── Bind resume and quit buttons ──────────────────────────────────
  _bindEvents() {
    this._el.querySelector("#pause-resume").addEventListener("click", () => {
      this._resume();
    });

    this._el.querySelector("#pause-quit").addEventListener("click", () => {
      this.hide();
      this._onQuit();
    });
  }

  // ── Internal resume handler ───────────────────────────────────────
  _resume() {
    this.hide();
    this._onResume();
  }

  // ── Show screen with fade in ──────────────────────────────────────
  show() {
    this._el.style.display = "flex";
    requestAnimationFrame(() => {
      this._el.classList.add("visible");
    });
  }

  // ── Hide screen with fade out ─────────────────────────────────────
  hide() {
    this._el.classList.remove("visible");
    this._el.addEventListener(
      "transitionend",
      () => {
        this._el.style.display = "none";
      },
      { once: true },
    );
  }

  // ── Remove from DOM ───────────────────────────────────────────────
  destroy() {
    this._el.remove();
  }
}
