/**
 * food.js — Food System
 * Responsibilities:
 *   - Track apple and bonus item positions
 *   - Spawn food on available (empty) cells only
 *   - Manage bonus item timer lifecycle
 *   - Detect when snake head overlaps food
 *
 * Does NOT: draw, modify snake, manage score, handle input
 */

import { CONFIG } from "./config.js";

export class Food {
  constructor(snake) {
    this.apple = null; // {col, row}
    this.bonus = null; // {col, row} | null
    this.appleCount = 0; // total apples eaten this game
    this.bonusTimer = null; // setTimeout reference

    // Spawn first apple on construction
    this.spawnApple(snake);
  }

  // ── Build pool of all cells not occupied by snake or other food ───
  _getAvailableCells(snake, excludeApple = false) {
    const cells = [];

    for (let row = 0; row < CONFIG.grid.rows; row++) {
      for (let col = 0; col < CONFIG.grid.cols; col++) {
        // Skip cells occupied by snake body
        if (snake.occupies(col, row)) continue;

        // Skip apple cell when spawning bonus
        if (
          excludeApple &&
          this.apple &&
          this.apple.col === col &&
          this.apple.row === row
        )
          continue;

        cells.push({ col, row });
      }
    }

    return cells;
  }

  // ── Pick a random cell from the available pool ────────────────────
  _randomCell(cells) {
    if (cells.length === 0) return null;
    const index = Math.floor(Math.random() * cells.length);
    return cells[index];
  }

  // ── Spawn apple on a random empty cell ───────────────────────────
  spawnApple(snake) {
    const available = this._getAvailableCells(snake, false);
    this.apple = this._randomCell(available);
  }

  // ── Spawn bonus item — avoids snake body and apple cell ──────────
  spawnBonus(snake) {
    // Clear any existing bonus first
    this.clearBonus();

    const available = this._getAvailableCells(snake, true);
    this.bonus = this._randomCell(available);

    if (!this.bonus) return; // no space available — skip

    // Auto-expire bonus after CONFIG.score.bonusDuration ms
    this.bonusTimer = setTimeout(() => {
      this.clearBonus();
    }, CONFIG.score.bonusDuration);
  }

  // ── Check if snake head is on the apple ──────────────────────────
  checkAppleEaten(snake) {
    if (!this.apple) return false;
    return snake.headAt(this.apple.col, this.apple.row);
  }

  // ── Check if snake head is on the bonus item ─────────────────────
  checkBonusEaten(snake) {
    if (!this.bonus) return false;
    return snake.headAt(this.bonus.col, this.bonus.row);
  }

  // ── Handle apple eaten: respawn + conditionally spawn bonus ───────
  onAppleEaten(snake) {
    this.appleCount++;
    this.spawnApple(snake);

    // Every Nth apple → spawn bonus item
    if (this.appleCount % CONFIG.score.bonusInterval === 0) {
      this.spawnBonus(snake);
    }
  }

  // ── Handle bonus eaten: clear item and cancel timer ──────────────
  onBonusEaten() {
    clearTimeout(this.bonusTimer);
    this.bonus = null;
    this.bonusTimer = null;
  }

  // ── Clear bonus (called on timer expire or reset) ─────────────────
  clearBonus() {
    clearTimeout(this.bonusTimer);
    this.bonus = null;
    this.bonusTimer = null;
  }

  // ── Check if bonus item is currently active ───────────────────────
  isBonusActive() {
    return this.bonus !== null;
  }

  // ── Reset food state for a new game ──────────────────────────────
  reset(snake) {
    this.clearBonus();
    this.appleCount = 0;
    this.spawnApple(snake);
  }
}
