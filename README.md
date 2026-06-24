# 🐍 Snake Game

![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, fully modular Snake game built with **Vite** and **Vanilla JavaScript**. Features a clean dark UI, two gameplay stages, progressive speed, bonus food system, and a complete HUD with score, best score, snake length, and time survived.

---

## 📸 Overview

The game is built entirely in the browser using the **HTML5 Canvas API** for rendering and **HTML/CSS** for the HUD and screen overlays. No frameworks, no runtime dependencies — pure JavaScript, structured like a professional project.

---

## ✨ Features

### 🎮 Gameplay
- **Two stages** — choose before every game
  - **Stage 1 (Beginner):** Walls wrap around — snake exits one side and reappears on the other
  - **Stage 2 (Classic):** Hard boundaries — hitting any wall ends the game instantly
- **Progressive speed** — snake gets faster every 10 points scored
- **Self-collision** — running into your own body ends the game in both stages
- **Smooth 60fps loop** — powered by `requestAnimationFrame` with delta time tracking

### 🍎 Food System
- **Apple** — always present on the grid, respawns immediately after eaten (+10 points)
- **Bonus Item** — gold star appears every 5th apple eaten, disappears after 5 seconds (+30 points)
- Both food items always spawn on empty cells — never on the snake body or each other

### 📊 HUD (Heads-Up Display)
| Field | Description |
|---|---|
| **Score** | Points earned in the current game |
| **Best** | Highest score achieved this session |
| **Length** | Current number of snake body segments |
| **Time** | Time survived in MM:SS format |

### 🖥️ Screens
| Screen | Trigger | Options |
|---|---|---|
| **Stage Select** | Game load / after quitting | Stage 1, Stage 2, Quit |
| **Pause** | Press P or Escape during play | Resume, Quit to Stage Select |
| **Game Over** | Collision detected | Play Again, Change Stage |

### 🐍 Snake Details
- Starts with 3 segments at the centre of the grid
- Distinct head colour with directional eyes
- Rounded segment style for a modern look
- Grows by 1 segment each time food is eaten

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| **Vite** | ^5.0.0 | Dev server + production bundler |
| **Vanilla JavaScript** | ES Modules | All game logic |
| **HTML5 Canvas API** | Native | Game rendering |
| **CSS3** | Native | HUD styling + screen transitions |
| **ESLint** | ^9.0.0 | Code linting |
| **Prettier** | ^3.0.0 | Code formatting |
| **npm** | — | Package management |
| **Git** | — | Version control |

> **Zero runtime dependencies** — the Canvas API is native to the browser.

---

## 📁 Project Structure

```
snake-game/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.js              # Entry point — bootstraps canvas, HUD, Game
│   ├── config.js            # Single source of truth for ALL constants
│   ├── game.js              # Game loop, state machine, orchestrator
│   ├── snake.js             # Snake entity — movement, growth, direction
│   ├── food.js              # Apple + bonus item lifecycle
│   ├── renderer.js          # All canvas drawing — nothing else draws
│   ├── collision.js         # Wall + self collision detection (pure functions)
│   ├── hud.js               # DOM HUD updater — score, best, length, time
│   ├── input.js             # Arrow key handler — fires callbacks only
│   └── screens/
│       ├── stageSelect.js   # Stage 1 / Stage 2 selection screen
│       ├── gameOver.js      # Game over screen with final stats
│       └── pause.js         # Pause screen with resume + quit
├── index.html               # HTML shell — canvas + HUD bar
├── package.json             # Project manifest + npm scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
└── .prettierrc              # Prettier formatting rules
```

---

## 🧩 Module Responsibilities

### `config.js`
Single source of truth. Every constant — grid size, colours, speeds, scores, stage identifiers — lives here. No magic numbers anywhere else in the codebase.

### `game.js`
The orchestrator. Owns the `requestAnimationFrame` game loop, the state machine (`STAGE_SELECT → PLAYING → PAUSED → GAME_OVER`), speed progression logic, Stage 1 wall wrap logic, and wires all modules together.

### `snake.js`
Pure state machine. Tracks body segments as `{col, row}` array, current direction, queued next direction, and growing flag. Exposes `move()`, `grow()`, `changeDirection()`, `getHead()`, `occupies()`.

### `food.js`
Manages apple and bonus item positions. Spawns food using an available cell pool (never on the snake). Handles bonus timer lifecycle via `setTimeout`. Fires events back to `game.js` on eat.

### `renderer.js`
The only module allowed to draw on the canvas. Draws background, snake (rounded rectangles with eyes), apple (circle with shine), and bonus item (circle with gold glow). Called once per frame.

### `collision.js`
Pure functions only — no state, no side effects. `checkWallCollision()` is stage-aware (Stage 1 always returns false). `checkSelfCollision()` checks head against `body[1..n]`. `hasCollided()` combines both.

### `hud.js`
Updates 4 DOM elements each frame. Tracks best score internally across games. Formats elapsed seconds into `MM:SS`. Does not own the timer — receives elapsed seconds from `game.js`.

### `input.js`
Registers a `keydown` listener and fires `onDirection` or `onPause` callbacks. Knows nothing about the snake or game state. `destroy()` cleanly removes the listener.

### `screens/`
Three HTML overlay classes — `StageSelectScreen`, `GameOverScreen`, `PauseScreen`. Each fades in/out via CSS opacity transition. All communicate back to `game.js` via callbacks.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A modern browser (Chrome recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/snake-game.git

# Navigate into the project
cd snake-game

# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint all source files
npm run lint

# Format all source files
npm run format
```

---

## 🎮 How to Play

### Controls
| Key | Action |
|---|---|
| `Arrow Up` | Move snake up |
| `Arrow Down` | Move snake down |
| `Arrow Left` | Move snake left |
| `Arrow Right` | Move snake right |
| `P` or `Escape` | Pause / Resume |

### Objective
- Guide the snake to eat the **red apple** to grow and score points
- Grab the **gold bonus item** when it appears for extra points — it disappears after 5 seconds!
- Avoid running into yourself
- Survive as long as possible

### Scoring
| Event | Points |
|---|---|
| Eat apple | +10 |
| Eat bonus item | +30 |

### Speed
The snake speeds up every **10 points**. The faster you score, the more intense the game becomes. There is a minimum speed floor so the game always remains playable.

---

## ⚙️ Game Configuration

All game constants are in `src/config.js`. You can tweak any of these values without touching game logic:

| Constant | Default | Description |
|---|---|---|
| `grid.cols` | 20 | Number of grid columns |
| `grid.rows` | 20 | Number of grid rows |
| `grid.cellSize` | 28px | Pixel size of each cell |
| `speed.initial` | 150ms | Starting game speed |
| `speed.increment` | 10ms | Speed increase per milestone |
| `speed.milestone` | 10pts | Points needed to trigger speed up |
| `speed.min` | 60ms | Fastest possible speed |
| `score.apple` | 10 | Points for eating apple |
| `score.bonus` | 30 | Points for eating bonus item |
| `score.bonusInterval` | 5 | Every Nth apple triggers bonus |
| `score.bonusDuration` | 5000ms | How long bonus item stays visible |

---

## 🚧 Constraints & Design Decisions

### Browser Only
This game runs entirely in the browser. It requires no server, no database, and no backend. All state is in memory — refreshing the page resets everything except nothing is persisted to localStorage by design.

### No Runtime Dependencies
The project has zero production dependencies. Vite, ESLint, and Prettier are dev-only tools. The game itself uses only Web APIs available in every modern browser.

### Single Canvas Rule
Only `renderer.js` is allowed to draw on the canvas. No other module calls `ctx` directly. This is a hard architectural rule that keeps rendering concerns isolated.

### Single Source of Truth
Every constant — colours, speeds, grid dimensions, scores — lives in `config.js`. No magic numbers exist anywhere else in the codebase.

### Pure Collision Functions
`collision.js` exports only pure functions with no side effects. They take inputs and return booleans — nothing more. This makes them easy to test and reason about.

### Modular State Machine
`game.js` owns the state machine with four explicit states: `STAGE_SELECT`, `PLAYING`, `PAUSED`, `GAME_OVER`. Every screen transition goes through this machine — no ad hoc state changes.

### Best Score Session Only
The best score persists across games within a browser session but resets on page refresh. No `localStorage` or external storage is used by design — keeping the game stateless and simple.

### window.close() Limitation
The **Quit Game** button uses `window.close()`. Browsers may block this if the tab was not opened by a script. In that case, simply close the tab manually.

---

## 📝 Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Tag | When to use |
|---|---|
| `chore:` | Project setup, config, tooling |
| `feat:` | New module or feature |
| `fix:` | Bug fix |
| `refactor:` | Restructure without behaviour change |
| `docs:` | README or comments |
| `style:` | Formatting, linting |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

*Built phase by phase with a design-first, modular approach. Every file has one job. Every constant has one home.*
