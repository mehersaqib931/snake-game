/**
 * game.js — Game Orchestrator
 * Responsibilities:
 *   - Own the game loop (requestAnimationFrame + delta time)
 *   - Manage game state machine (STAGE_SELECT, PLAYING, PAUSED, GAME_OVER)
 *   - Orchestrate all modules: snake, food, renderer, hud, input, screens
 *   - Handle Stage 1 wall wrap logic
 *   - Manage score, speed progression, and timer
 *
 * This is the only module that knows about all other modules.
 */

import { CONFIG } from "./config.js";
import { Snake } from "./snake.js";
import { Food } from "./food.js";
import { Renderer } from "./renderer.js";
import { HUD } from "./hud.js";
import { InputHandler } from "./input.js";
import { hasCollided } from "./collision.js";
import { StageSelectScreen } from "./screens/stageSelect.js";
import { GameOverScreen } from "./screens/gameOver.js";
import { PauseScreen } from "./screens/pause.js";

// ── Game States ───────────────────────────────────────────────────
const STATES = {
  STAGE_SELECT: "STAGE_SELECT",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
};

export class Game {
  /**
   * @param {HTMLCanvasElement}          canvas
   * @param {CanvasRenderingContext2D}   ctx
   * @param {{ score, best, length, time: HTMLElement }} hudElements
   */
  constructor(canvas, ctx, hudElements) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = STATES.STAGE_SELECT;
    this.stage = CONFIG.stage.wrap; // default stage
    this.score = 0;
    this.startTime = null;
    this.lastTickTime = 0;
    this.currentSpeed = CONFIG.speed.initial;
    this.animFrameId = null;

    // ── Instantiate core modules ───────────────────────────────────
    this.snake = new Snake();
    this.food = new Food(this.snake);
    this.renderer = new Renderer(ctx);
    this.hud = new HUD(hudElements);
    this.input = null; // created on game start

    // ── Instantiate screens ────────────────────────────────────────
    const wrapper = canvas.parentElement;

    this.stageSelectScreen = new StageSelectScreen(wrapper, (stage) =>
      this._onStageSelect(stage),
    );

    this.gameOverScreen = new GameOverScreen(
      wrapper,
      () => this._restart(),
      () => this._backToStageSelect(),
    );

    this.pauseScreen = new PauseScreen(wrapper, () => this._onResume());

    // Bind loop so rAF reference stays consistent
    this._loop = this._loop.bind(this);
  }

  // ── Entry point called from main.js ──────────────────────────────
  start() {
    this.stageSelectScreen.show();
  }

  // ── Main rAF loop ─────────────────────────────────────────────────
  /**
   * @param {DOMHighResTimeStamp} timestamp
   */
  _loop(timestamp) {
    this.animFrameId = requestAnimationFrame(this._loop);

    // Only tick when actively playing
    if (this.state !== STATES.PLAYING) return;

    // Delta time — only move snake when enough time has passed
    const delta = timestamp - this.lastTickTime;
    if (delta >= this.currentSpeed) {
      this.lastTickTime = timestamp;
      this._tick();
    }

    // Update HUD every frame with latest elapsed time
    const elapsed = this._getElapsed();
    this.hud.update(this.score, this.snake.getLength(), elapsed);

    // Render every frame
    this.renderer.render(this.snake, this.food);
  }

  // ── One game logic tick ───────────────────────────────────────────
  _tick() {
    // Move snake forward
    this.snake.move();

    // Stage 1 — wrap head around grid edges
    if (this.stage === CONFIG.stage.wrap) {
      this._handleWrap();
    }

    // Check collisions — wall (Stage 2) + self
    if (hasCollided(this.snake, this.stage)) {
      this._gameOver();
      return;
    }

    // Check apple eaten
    if (this.food.checkAppleEaten(this.snake)) {
      this.snake.grow();
      this.score += CONFIG.score.apple;
      this.food.onAppleEaten(this.snake);
      this._updateSpeed();
    }

    // Check bonus eaten
    if (this.food.checkBonusEaten(this.snake)) {
      this.score += CONFIG.score.bonus;
      this.food.onBonusEaten();
    }
  }

  // ── Stage 1 wrap — modulo arithmetic on head position ────────────
  _handleWrap() {
    const head = this.snake.getHead();
    const { cols, rows } = CONFIG.grid;
    head.col = ((head.col % cols) + cols) % cols;
    head.row = ((head.row % rows) + rows) % rows;
  }

  // ── Speed progression — called after each apple eaten ────────────
  _updateSpeed() {
    if (this.score % CONFIG.speed.milestone === 0) {
      this.currentSpeed = Math.max(
        CONFIG.speed.min,
        this.currentSpeed - CONFIG.speed.increment,
      );
    }
  }

  // ── Get elapsed seconds since game start ─────────────────────────
  _getElapsed() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  // ── Format elapsed seconds → MM:SS ───────────────────────────────
  _formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  // ── Handle stage selected from StageSelectScreen ─────────────────
  _onStageSelect(stage) {
    this.stage = stage;
    this._restart();
  }

  // ── Restart game — same stage ─────────────────────────────────────
  _restart() {
    // Cancel any running loop
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    // Destroy old input handler
    if (this.input) {
      this.input.destroy();
      this.input = null;
    }

    // Reset game state
    this.score = 0;
    this.currentSpeed = CONFIG.speed.initial;
    this.startTime = Date.now();
    this.lastTickTime = 0;
    this.state = STATES.PLAYING;

    // Reset modules
    this.snake.reset();
    this.food.reset(this.snake);
    this.hud.reset();

    // Fresh input handler
    this.input = new InputHandler(
      (dir) => this.snake.changeDirection(dir),
      () => this.togglePause(),
    );

    // Start loop
    this.animFrameId = requestAnimationFrame(this._loop);
  }

  // ── Return to stage select screen ─────────────────────────────────
  _backToStageSelect() {
    // Cancel loop + destroy input
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.input) {
      this.input.destroy();
      this.input = null;
    }

    this.state = STATES.STAGE_SELECT;
    this.hud.reset();
    this.stageSelectScreen.show();
  }

  // ── Game over ─────────────────────────────────────────────────────
  _gameOver() {
    this.state = STATES.GAME_OVER;

    // Cancel loop + destroy input
    cancelAnimationFrame(this.animFrameId);
    this.animFrameId = null;

    if (this.input) {
      this.input.destroy();
      this.input = null;
    }

    // Show game over screen with final stats
    const elapsed = this._getElapsed();
    this.gameOverScreen.show({
      score: this.score,
      best: this.hud.bestScore,
      length: this.snake.getLength(),
      time: this._formatTime(elapsed),
    });
  }

  // ── Toggle pause / resume ─────────────────────────────────────────
  togglePause() {
    if (this.state === STATES.PLAYING) {
      this.state = STATES.PAUSED;
      this.pauseScreen.show();
    } else if (this.state === STATES.PAUSED) {
      this._onResume();
    }
  }

  // ── Resume from pause ─────────────────────────────────────────────
  _onResume() {
    this.pauseScreen.hide();
    this.state = STATES.PLAYING;

    // Reset lastTickTime to now — prevents a massive delta jump
    // that would cause the snake to move instantly on resume
    this.lastTickTime = performance.now();
  }
}
