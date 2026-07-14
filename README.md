# FlyRank AI — Frontend Capstone Project

A capstone project developed during the **FlyRank AI Frontend Internship**. This repository documents the end-to-end build of a modern frontend application using React, Next.js, TypeScript, and Tailwind CSS—with an emphasis on clean architecture, type safety, and AI-assisted development workflows.

> **Status:** Early development — project scaffolding and core features are in progress.

---

## Table of Contents

- [About](#about)
- [Goals & Learning Outcomes](#goals--learning-outcomes)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Roadmap](#roadmap)
- [License](#license)

---

## About

FlyRank AI Frontend Capstone is a hands-on portfolio project built to demonstrate professional frontend engineering practices. Over the course of the internship, this repository will evolve from initial setup into a fully functional application showcasing component design, responsive UI, and maintainable code organization.

---

## Goals & Learning Outcomes

- Build a production-ready frontend with **React** and **Next.js**
- Enforce **TypeScript** type safety across components, hooks, and utilities
- Apply **Tailwind CSS** for consistent, utility-first styling
- Practice modular component architecture and reusable abstractions
- Integrate **AI-assisted development** (Cursor IDE) into a real-world workflow
- Follow Git-based collaboration and documentation best practices

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) + [React](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Tooling | [Cursor IDE](https://cursor.com/) |
| Package Manager | npm |

---

## Prerequisites

Before you begin, ensure the following are installed:

- **Node.js** 18.x or later ([download](https://nodejs.org/))
- **npm** 9.x or later (included with Node.js)
- **Git** ([download](https://git-scm.com/))

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ALCUNE/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for production

```bash
npm run build
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally (after `build`) |
| `npm run lint` | Run ESLint checks *(when configured)* |

---

## Project Structure

```
flyrank-frontend-capstone/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and shared helpers
├── public/               # Static assets
├── CLAUDE.md             # AI assistant and project conventions
├── .gitignore
└── README.md
```

> Structure will expand as features are implemented during the internship.

---

## Development Guidelines

### Components & Hooks

- Use **functional components** with explicit TypeScript prop types
- Extract reusable logic into **custom hooks** (`use*` naming convention)
- Keep components focused and composable (single responsibility)

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button.tsx`, `UserProfile.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |

### Imports

Group imports in this order:

1. External libraries
2. Internal modules (via `@/` path alias)

### Code Quality

- Prefer type safety; avoid `any`
- Keep code DRY and modular
- Document non-obvious business logic with brief comments

For full AI assistant conventions, see [`CLAUDE.md`](./CLAUDE.md).

---

## Roadmap

- [x] Initialize repository and documentation
- [ ] Scaffold Next.js + TypeScript + Tailwind CSS project
- [ ] Implement core layout and navigation
- [ ] Build primary feature pages and components
- [ ] Add responsive design and accessibility improvements
- [ ] Production build optimization and deployment

---

## License

This project is licensed under the **MIT License** — Copyright (c) 2026 Deniz.

---

## Author

**Deniz** — FlyRank AI Frontend Internship Capstone Project
