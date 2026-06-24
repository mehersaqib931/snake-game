/**
 * gameOver.js — Game Over Screen
 * Responsibilities:
 *   - Render HTML overlay showing final score, best, time
 *   - Fire onRestart() for same-stage replay
 *   - Fire onChangeStage() to return to stage select
 *   - Fade in/out smoothly via CSS transition
 *
 * Does NOT: manage game state, draw on canvas, track scores
 */

export class GameOverScreen {
  /**
   * @param {HTMLElement}        container      - parent element (game-wrapper)
   * @param {function():void}    onRestart      - called on Play Again
   * @param {function():void}    onChangeStage  - called on Change Stage
   */
  constructor(container, onRestart, onChangeStage) {
    this._onRestart = onRestart;
    this._onChangeStage = onChangeStage;
    this._el = this._createElement();
    container.appendChild(this._el);
    this._bindEvents();
  }

  // ── Build overlay DOM ─────────────────────────────────────────────
  _createElement() {
    const el = document.createElement("div");
    el.className = "screen-overlay";
    el.id = "screen-game-over";
    el.innerHTML = `
      <div class="screen-box">
        <div class="screen-title">Game Over</div>

        <div class="gameover-stats">
          <div class="stat-row">
            <span class="stat-label">Score</span>
            <span class="stat-value" id="go-score">0</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Best</span>
            <span class="stat-value accent" id="go-best">0</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Length</span>
            <span class="stat-value" id="go-length">3</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Time</span>
            <span class="stat-value" id="go-time">00:00</span>
          </div>
        </div>

        <div class="screen-actions">
          <button class="btn-primary" id="go-restart">Play Again</button>
          <button class="btn-secondary" id="go-change-stage">Change Stage</button>
        </div>
      </div>
    `;
    return el;
  }

  // ── Bind button events ────────────────────────────────────────────
  _bindEvents() {
    this._el.querySelector("#go-restart").addEventListener("click", () => {
      this.hide();
      this._onRestart();
    });

    this._el.querySelector("#go-change-stage").addEventListener("click", () => {
      this.hide();
      this._onChangeStage();
    });
  }

  // ── Show screen with final game data ─────────────────────────────
  /**
   * @param {{ score: number, best: number, length: number, time: string }} data
   */
  show(data) {
    this._el.querySelector("#go-score").textContent = data.score;
    this._el.querySelector("#go-best").textContent = data.best;
    this._el.querySelector("#go-length").textContent = data.length;
    this._el.querySelector("#go-time").textContent = data.time;

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
