/**
 * snake.js — Snake Entity
 * Responsibilities:
 *   - Track body segments, direction, and growth state
 *   - Move the snake forward each tick
 *   - Validate and queue direction changes
 *   - Expose state to game.js via clean methods
 *
 * Does NOT: draw, detect collisions, handle input, manage score
 */

import { CONFIG } from "./config.js";

// ── Direction vectors ──────────────────────────────────────────────
const DIRECTION_MAP = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

// ── Opposite directions — used to reject reverse moves ─────────────
const OPPOSITES = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export class Snake {
  constructor() {
    this.reset();
  }

  // ── Initialise / reset to starting state from CONFIG ─────────────
  reset() {
    const { startCol, startRow, startLength, startDirection } = CONFIG.snake;

    // Build initial body — head at startCol/startRow, extending left
    this.body = [];
    for (let i = 0; i < startLength; i++) {
      this.body.push({ col: startCol - i, row: startRow });
    }

    this.direction = startDirection; // current direction
    this.nextDirection = startDirection; // queued direction
    this.growing = false; // growth flag
  }

  // ── Move snake one step forward ───────────────────────────────────
  move() {
    // Apply the queued direction
    this.direction = this.nextDirection;

    const { dx, dy } = DIRECTION_MAP[this.direction];
    const head = this.getHead();

    // Calculate new head position
    const newHead = {
      col: head.col + dx,
      row: head.row + dy,
    };

    // Add new head at the front
    this.body.unshift(newHead);

    // If growing — keep tail (clear flag); otherwise remove tail
    if (this.growing) {
      this.growing = false;
    } else {
      this.body.pop();
    }
  }

  // ── Queue a direction change (rejects reversal + same dir) ────────
  changeDirection(newDir) {
    // Ignore unknown directions
    if (!DIRECTION_MAP[newDir]) return;

    // Ignore if same as current direction
    if (newDir === this.direction) return;

    // Ignore if direct reversal
    if (newDir === OPPOSITES[this.direction]) return;

    this.nextDirection = newDir;
  }

  // ── Signal the snake to grow on the next move ─────────────────────
  grow() {
    this.growing = true;
  }

  // ── Return the head segment {col, row} ────────────────────────────
  getHead() {
    return this.body[0];
  }

  // ── Return current body length ────────────────────────────────────
  getLength() {
    return this.body.length;
  }

  // ── Check if snake occupies a given cell ──────────────────────────
  occupies(col, row) {
    return this.body.some((seg) => seg.col === col && seg.row === row);
  }

  // ── Check if snake head occupies a given cell ─────────────────────
  headAt(col, row) {
    const head = this.getHead();
    return head.col === col && head.row === row;
  }
}
