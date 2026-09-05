# Algorithm Visualizer

An interactive, frontend-only algorithm visualizer built with **Vite + React + TypeScript + TailwindCSS**. Covers 11 DSA categories with step-by-step animated visualizations.

![Build](https://img.shields.io/badge/build-passing-brightgreen) ![Modules](https://img.shields.io/badge/modules-104-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 11 Algorithm Categories (104 TypeScript modules)

| Category | Algorithms |
|----------|-----------|
| **📊 Sorting** | Bubble, Selection, Insertion, Merge, Quick, Heap Sort |
| **🔍 Searching** | Linear, Binary Search |
| **🗺️ Pathfinding** | Dijkstra, A*, BFS, DFS (interactive grid) |
| **🔗 Graphs** | BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim's MST, Kruskal's MST, Topological Sort, Kosaraju's SCC, Union-Find |
| **🌳 Trees** | BST Insert/Search, AVL Rotations (LL/LR/RR/RL), Inorder/Preorder/Postorder/Level-order Traversal, Heap Insert/Extract, Trie |
| **📦 Data Structures** | Stack (push/pop), Queue (enqueue/dequeue), Linked List (insert/delete/reverse) |
| **🌀 Recursion** | Factorial, Fibonacci, Tower of Hanoi, Josephus Problem, Power Set |
| **🧮 Dynamic Programming** | Fibonacci DP, 0/1 Knapsack, LCS, Edit Distance, Matrix Chain Multiplication, Coin Change, Subset Sum |
| **💰 Greedy** | Activity Selection, Fractional Knapsack, Huffman Coding, Job Sequencing |
| **🔙 Backtracking** | N-Queens, Rat in Maze, Sudoku Solver, Subset Sum, Permutations |
| **🔤 String Algorithms** | Naive Match, KMP, Rabin-Karp, Z-Algorithm |

### Capabilities

- ▶️ **Animated visualization** with adjustable playback speed
- ⏮ **Step-by-step navigation** — forward, backward, skip-to-end
- 🎨 **Color-coded states** per algorithm type (comparing, swapping, sorted, visited, path, etc.)
- 🖱 **Interactive grids** for pathfinding and maze problems
- 🎲 **Random data generation** with configurable parameters
- 🔁 **Per-algorithm re-run** without losing tab state
- 📱 **Responsive design** — works on desktop and mobile
- 🐙 **GitHub attribution footer** via the reusable `Github` component (`<Github repo author authorUrl />`)
- ⚡ **104 TypeScript modules** compile cleanly with zero errors in strict mode

## 🏗️ Architecture

```
src/
├── algorithms/         # Pure functions returning step arrays (one folder per category)
│   ├── sorting/        # 6 algorithms
│   ├── searching/      # 2 algorithms
│   ├── pathfinding/    # 4 algorithms
│   ├── graphs/         # 10 algorithms
│   ├── trees/          # 5 algorithms
│   ├── datastructures/ # Stack, Queue, Linked List
│   ├── recursion/      # 5 algorithms
│   ├── dynamicprog/    # 7 algorithms
│   ├── greedy/         # 4 algorithms
│   ├── backtracking/   # 5 algorithms
│   └── strings/        # 4 algorithms
├── components/         # Visualizers + tab panels
│   ├── ArrayVisualizer, GridVisualizer      # Sorting/Searching/Pathfinding
│   ├── GraphVisualizer, TreeVisualizer      # Graph/Tree SVG renderers
│   ├── GenericVisualizer                    # Discriminated-union step renderer
│   ├── StepPanel                            # Reusable step-by-step control panel
│   ├── SortingPanel … StringPanel           # One panel per category tab
│   └── Github                               # Footer attribution component
├── hooks/
│   └── useAnimation.ts                      # Play/pause/step/speed animation driver
├── types/index.ts                           # All step + algorithm category types
└── utils/                                   # Layout helpers, sample data, sleep, etc.
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm** (or pnpm / yarn)

### Install & run

```bash
npm install
npm run dev          # start Vite dev server (default: http://localhost:5173)
```

### Build for production

```bash
npm run build        # tsc + vite build  →  dist/
npm run preview      # preview the production build locally
```

### Type-check only

```bash
npx tsc --noEmit
```

### Build output

```
dist/index.html                   0.48 kB │ gzip:   0.31 kB
dist/assets/index-*.css          16.55 kB │ gzip:   4.06 kB
dist/assets/index-*.js          247.73 kB │ gzip:  72.30 kB
```

## 🧩 Adding a New Algorithm

1. Pick or create a category folder under `src/algorithms/`.
2. Implement a pure function that takes inputs and returns `Step[]` (or a category-specific step type).
3. Register it in the category's `index.ts` registry.
4. Add a row to that category's `*Panel.tsx` — the panel re-renders the visualizer with each new step.

The `StepPanel` + `useAnimation` pair handle play/pause, step-forward/back, speed slider, and a progress bar automatically.

## 🛠️ Tech Stack

- **[Vite 5](https://vitejs.dev/)** — Build tool & dev server
- **[React 18](https://react.dev/)** — UI framework
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type safety (strict mode, zero errors)
- **[TailwindCSS 3](https://tailwindcss.com/)** — Utility-first styling
- **No runtime dependencies** beyond the above — fully self-contained

## 📄 License

MIT — see the footer of the running app for the full attribution line (powered by the `<Github />` component in `src/components/Github.tsx`).
