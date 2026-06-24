/**
 * stageSelect.js — Stage Selection Screen
 * Responsibilities:
 *   - Render HTML overlay for stage selection on game load
 *   - Fire onStageSelect(stage) callback with 1 or 2
 *   - Fade in/out smoothly via CSS transition
 *
 * Does NOT: manage game state, draw on canvas, handle game logic
 */

export class StageSelectScreen {
  /**
   * @param {HTMLElement}          container       - parent element (game-wrapper)
   * @param {function(number):void} onStageSelect  - called with 1 or 2
   */
  constructor(container, onStageSelect) {
    this._onStageSelect = onStageSelect;
    this._el = this._createElement();
    container.appendChild(this._el);
    this._bindEvents();
  }

  // ── Build overlay DOM ─────────────────────────────────────────────
  _createElement() {
    const el = document.createElement("div");
    el.className = "screen-overlay";
    el.id = "screen-stage-select";
    el.innerHTML = `
      <div class="screen-box">
        <div class="screen-title">🐍 Snake</div>
        <div class="screen-subtitle">Choose Your Stage</div>

        <div class="stage-cards">
          <button class="stage-card" data-stage="1">
            <span class="stage-number">Stage 1</span>
            <span class="stage-name">Beginner</span>
            <span class="stage-desc">Walls wrap around<br>Learn the ropes</span>
          </button>

          <button class="stage-card" data-stage="2">
            <span class="stage-number">Stage 2</span>
            <span class="stage-name">Classic</span>
            <span class="stage-desc">Hard boundaries<br>One mistake = game over</span>
          </button>
        </div>

        <div class="screen-hint">Use Arrow Keys to control the snake</div>
      </div>
    `;
    return el;
  }

  // ── Bind stage button clicks ──────────────────────────────────────
  _bindEvents() {
    this._el.querySelectorAll(".stage-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const stage = parseInt(btn.dataset.stage, 10);
        this.hide();
        this._onStageSelect(stage);
      });
    });
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
