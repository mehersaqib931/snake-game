/**
 * hud.js — HUD Display
 * Responsibilities:
 *   - Update the 4 HTML DOM elements with current game values
 *   - Track and persist best score across games
 *   - Format elapsed seconds into MM:SS display
 *   - Reset display values on new game (except best score)
 *
 * Does NOT: own the timer, manage game state, draw on canvas
 * Timer is owned by game.js — elapsed seconds passed in via update()
 */

export class HUD {
  /**
   * @param {{ score: HTMLElement, best: HTMLElement,
   *           length: HTMLElement, time: HTMLElement }} elements
   */
  constructor(elements) {
    this.elements = elements;
    this.bestScore = 0; // persists across games in this session
  }

  // ── Master update — called every game tick ────────────────────────
  /**
   * @param {number} score          - current score
   * @param {number} snakeLength    - current snake body length
   * @param {number} elapsedSeconds - seconds since game started
   */
  update(score, snakeLength, elapsedSeconds) {
    this._updateScore(score);
    this._updateBest(score);
    this._updateLength(snakeLength);
    this._updateTime(elapsedSeconds);
  }

  // ── Reset display for new game (best score preserved) ────────────
  reset() {
    this.elements.score.textContent = "0";
    this.elements.length.textContent = "3";
    this.elements.time.textContent = "00:00";
    // bestScore intentionally NOT reset — persists across games
  }

  // ── Private updaters ──────────────────────────────────────────────

  _updateScore(score) {
    this.elements.score.textContent = score;
  }

  _updateBest(score) {
    if (score > this.bestScore) {
      this.bestScore = score;
    }
    this.elements.best.textContent = this.bestScore;
  }

  _updateLength(length) {
    this.elements.length.textContent = length;
  }

  _updateTime(elapsedSeconds) {
    this.elements.time.textContent = this._formatTime(elapsedSeconds);
  }

  // ── Format seconds → MM:SS string ────────────────────────────────
  /**
   * @param {number} totalSeconds
   * @returns {string} e.g. 125 → '02:05'
   */
  _formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }
}
