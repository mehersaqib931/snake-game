/**
 * renderer.js — Canvas Renderer
 * Responsibilities:
 *   - Clear the canvas each frame
 *   - Draw snake body and head
 *   - Draw apple with shine effect
 *   - Draw bonus item with glow effect
 *   - Provide a single render() call for the game loop
 *
 * Does NOT: manage game state, handle input, update scores
 * Rule: NOTHING else in the codebase draws to the canvas
 */

import { CONFIG } from "./config.js";

const { cellSize } = CONFIG.grid;
const SEGMENT_PADDING = 2; // gap between segments
const SEGMENT_SIZE = cellSize - SEGMENT_PADDING * 2; // drawable area
const SEGMENT_RADIUS = 6; // corner roundness (px)
const FOOD_RADIUS = cellSize / 2 - 4; // apple/bonus circle radius

export class Renderer {
  /**
   * @param {CanvasRenderingContext2D} ctx - 2D canvas context
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  // ── Cell → pixel helpers ──────────────────────────────────────────
  _cellX(col) {
    return col * cellSize;
  }

  _cellY(row) {
    return row * cellSize;
  }

  // ── Rounded rectangle helper ──────────────────────────────────────
  _roundRect(x, y, w, h, radius) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  }

  // ── Clear canvas with background colour ───────────────────────────
  clear() {
    const ctx = this.ctx;
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, CONFIG.grid.width, CONFIG.grid.height);
  }

  // ── Draw full snake (tail → head so head renders on top) ──────────
  drawSnake(snake) {
    const ctx = this.ctx;
    const body = snake.body;

    // Draw body segments in reverse (tail first)
    for (let i = body.length - 1; i >= 0; i--) {
      const { col, row } = body[i];
      const x = this._cellX(col) + SEGMENT_PADDING;
      const y = this._cellY(row) + SEGMENT_PADDING;
      const isHead = i === 0;

      // Head is brighter, body is slightly muted
      ctx.fillStyle = isHead
        ? CONFIG.colors.snakeHead
        : CONFIG.colors.snakeBodyStart;

      this._roundRect(x, y, SEGMENT_SIZE, SEGMENT_SIZE, SEGMENT_RADIUS);

      // Draw eyes on head
      if (isHead) {
        this._drawEyes(col, row, snake.direction);
      }
    }
  }

  // ── Draw two small eyes on the snake head ─────────────────────────
  _drawEyes(col, row, direction) {
    const ctx = this.ctx;
    const cx = this._cellX(col) + cellSize / 2;
    const cy = this._cellY(row) + cellSize / 2;
    const eyeR = 2.5;
    const offset = 5;

    ctx.fillStyle = "#0f0f1a";

    // Eye positions shift based on direction
    let eye1, eye2;
    switch (direction) {
      case "RIGHT":
        eye1 = { x: cx + 3, y: cy - offset };
        eye2 = { x: cx + 3, y: cy + offset };
        break;
      case "LEFT":
        eye1 = { x: cx - 3, y: cy - offset };
        eye2 = { x: cx - 3, y: cy + offset };
        break;
      case "UP":
        eye1 = { x: cx - offset, y: cy - 3 };
        eye2 = { x: cx + offset, y: cy - 3 };
        break;
      case "DOWN":
        eye1 = { x: cx - offset, y: cy + 3 };
        eye2 = { x: cx + offset, y: cy + 3 };
        break;
    }

    [eye1, eye2].forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, eyeR, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ── Draw apple with shine dot ─────────────────────────────────────
  drawApple(apple) {
    if (!apple) return;

    const ctx = this.ctx;
    const cx = this._cellX(apple.col) + cellSize / 2;
    const cy = this._cellY(apple.row) + cellSize / 2;

    // Main apple circle
    ctx.fillStyle = CONFIG.colors.apple;
    ctx.beginPath();
    ctx.arc(cx, cy, FOOD_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Shine dot — top right
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(
      cx + FOOD_RADIUS * 0.3,
      cy - FOOD_RADIUS * 0.35,
      FOOD_RADIUS * 0.22,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // ── Draw bonus item with glow effect ─────────────────────────────
  drawBonus(bonus) {
    if (!bonus) return;

    const ctx = this.ctx;
    const cx = this._cellX(bonus.col) + cellSize / 2;
    const cy = this._cellY(bonus.row) + cellSize / 2;

    // Glow effect via shadow
    ctx.save();
    ctx.shadowColor = CONFIG.colors.bonus;
    ctx.shadowBlur = 16;

    // Main bonus circle
    ctx.fillStyle = CONFIG.colors.bonus;
    ctx.beginPath();
    ctx.arc(cx, cy, FOOD_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Shine dot — top right
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(
      cx + FOOD_RADIUS * 0.3,
      cy - FOOD_RADIUS * 0.35,
      FOOD_RADIUS * 0.22,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // ── Master render call — called every game tick ───────────────────
  render(snake, food) {
    this.clear();
    this.drawSnake(snake);
    this.drawApple(food.apple);

    if (food.isBonusActive()) {
      this.drawBonus(food.bonus);
    }
  }
}
