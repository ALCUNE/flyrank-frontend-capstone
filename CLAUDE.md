# FlyRank AI - Frontend Capstone Rules

## Build & Development Commands

- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build production bundle: `npm run build`

## Code Style & Guidelines

- **Framework:** React / Next.js with TypeScript.
- **Styling:** Tailwind CSS (utility-first approach).
- **Component Structure:** Functional components with descriptive prop types. Use hooks for state and side effects.
- **Naming Conventions:**
  - Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
  - Hooks: camelCase starting with "use" (e.g., `useAuth.ts`)
  - Utilities/Helpers: camelCase (e.g., `formatDate.ts`)
- **Imports:** Group external libraries first, followed by internal absolute paths (using `@/`).



## AI Assistant Instructions

- Provide clean, modular, and dry (Don't Repeat Yourself) code.
- Prioritize TypeScript type safety; avoid using `any`.
- Always explain the "why" behind complex architectural or state management decisions.

