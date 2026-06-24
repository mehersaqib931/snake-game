/**
 * config.js — Single Source of Truth
 * All game constants live here. Nothing is a magic number elsewhere.
 */

export const CONFIG = {
  // ─── Canvas & Grid ───────────────────────────────────────────────
  grid: {
    cellSize: 28,       // pixel size of each grid cell
    cols: 20,           // number of columns
    rows: 20,           // number of rows
    width: 28 * 20,     // canvas width  → 560px
    height: 28 * 20,    // canvas height → 560px
  },

  // ─── Speed & Progression ─────────────────────────────────────────
  speed: {
    initial: 150,       // starting game loop interval in ms
    increment: 10,      // ms reduction per milestone
    milestone: 10,      // every X points → speed increases
    min: 60,            // fastest possible speed (floor) in ms
  },

  // ─── Scoring ─────────────────────────────────────────────────────
  score: {
    apple: 10,          // points awarded for eating an apple
    bonus: 30,          // points awarded for eating bonus item
    bonusInterval: 5,   // every Nth apple triggers a bonus spawn
    bonusDuration: 5000,// bonus item visible for 5 seconds (ms)
  },

  // ─── Stages ──────────────────────────────────────────────────────
  stage: {
    wrap: 1,            // Stage 1 — wrap around walls
    hard: 2,            // Stage 2 — hard boundary (game over on wall hit)
  },

  // ─── Colours & Theme ─────────────────────────────────────────────
  colors: {
    bg: '#0f0f1a',              // deep dark navy background
    grid: '#1a1a2e',            // subtle grid line color
    snakeHead: '#00ff88',       // bright green snake head
    snakeBodyStart: '#00cc66',  // gradient start (near head)
    snakeBodyEnd: '#005533',    // gradient end   (tail)
    apple: '#ff4444',           // vivid red apple
    bonus: '#ffd700',           // gold bonus item
    hudText: '#ffffff',         // HUD primary text
    hudAccent: '#00ff88',       // HUD accent (matches snake head)
    overlay: 'rgba(15,15,26,0.85)', // screen overlay (pause/game over)
  },

  // ─── HUD ─────────────────────────────────────────────────────────
  hud: {
    height: 60,         // px reserved at top for HUD bar
    fontSize: 14,       // base font size in px
    fontFamily: "'Segoe UI', Arial, sans-serif",
    padding: 16,        // horizontal padding inside HUD
  },

  // ─── Snake Starting State ─────────────────────────────────────────
  snake: {
    startLength: 3,           // initial number of segments
    startCol: 10,             // starting column (centre of grid)
    startRow: 10,             // starting row    (centre of grid)
    startDirection: 'RIGHT',  // initial movement direction
  },
};