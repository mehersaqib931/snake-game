/**
 * collision.js — Collision Detection
 * Responsibilities:
 *   - Detect wall collision (Stage 2 hard boundary only)
 *   - Detect self collision (head overlaps body)
 *   - Provide convenience hasCollided() combining both checks
 *
 * Does NOT: mutate snake, handle wrap logic, manage game state
 * Pure functions only — no class, no side effects, no stored state
 */

import { CONFIG } from "./config.js";

// ── Wall Collision ─────────────────────────────────────────────────
/**
 * Check if snake head is outside grid bounds.
 * Stage 1 (wrap): always returns false — game.js handles wrapping.
 * Stage 2 (hard): returns true if head is out of bounds.
 *
 * @param {Snake}  snake - the snake instance
 * @param {number} stage - current stage (CONFIG.stage.wrap | CONFIG.stage.hard)
 * @returns {boolean}
 */
export function checkWallCollision(snake, stage) {
  // Stage 1 — wrap around, no wall collision possible
  if (stage === CONFIG.stage.wrap) return false;

  // Stage 2 — hard boundary
  const head = snake.getHead();
  const { cols, rows } = CONFIG.grid;

  return (
    head.col < 0 || // hit left wall
    head.col >= cols || // hit right wall
    head.row < 0 || // hit top wall
    head.row >= rows // hit bottom wall
  );
}

// ── Self Collision ─────────────────────────────────────────────────
/**
 * Check if snake head overlaps any body segment after index 0.
 * body[0] is the head itself — excluded from check to avoid
 * false positives.
 *
 * @param {Snake} snake - the snake instance
 * @returns {boolean}
 */
export function checkSelfCollision(snake) {
  const head = snake.getHead();
  const body = snake.body;

  // Check all segments except the head (index 0)
  for (let i = 1; i < body.length; i++) {
    if (body[i].col === head.col && body[i].row === head.row) {
      return true;
    }
  }

  return false;
}

// ── Combined Collision Check ───────────────────────────────────────
/**
 * Convenience function — returns true if either wall or self
 * collision is detected.
 *
 * @param {Snake}  snake - the snake instance
 * @param {number} stage - current stage
 * @returns {boolean}
 */
export function hasCollided(snake, stage) {
  return checkWallCollision(snake, stage) || checkSelfCollision(snake);
}
