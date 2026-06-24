/**
 * main.js — Entry Point
 * Responsibilities:
 *   1. Wait for DOM to be ready
 *   2. Grab canvas + set dimensions from CONFIG
 *   3. Get 2D rendering context
 *   4. Collect HUD DOM elements
 *   5. Instantiate Game and start it
 *
 * Does NOT contain: game logic, drawing, event listeners
 */

import { CONFIG } from "./config.js";
import { Game } from "./game.js";

// ── Wait for DOM ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── Canvas setup ────────────────────────────────────────────────
  const canvas = document.getElementById("gameCanvas");
  canvas.width = CONFIG.grid.width;
  canvas.height = CONFIG.grid.height;

  const ctx = canvas.getContext("2d");

  // ── HUD elements ────────────────────────────────────────────────
  const hudElements = {
    score: document.getElementById("hud-score"),
    best: document.getElementById("hud-best"),
    length: document.getElementById("hud-length"),
    time: document.getElementById("hud-time"),
  };

  // ── Bootstrap game ──────────────────────────────────────────────
  const game = new Game(canvas, ctx, hudElements);
  game.start();
});
