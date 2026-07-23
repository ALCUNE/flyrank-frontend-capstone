# Week 3 Assignment: React App Development with AI

## 1. Project Overview & Deliverables
- **Repository URL:** https://github.com/ALCUNE/flyrank-frontend-capstone
- **Core Feature:** User Profile Update Form with real-time validation, dynamic avatar uploads, responsive Tailwind CSS layout, and full WCAG accessibility compliance.

---

## 2. Prompts Used During Development

### Prompt 1: Initial Architecture & Setup
> "Set up a clean Next.js + React project structure with TypeScript, Tailwind CSS, and Jest test suite."

### Prompt 2: Core Component Generation (Precision Prompting)
> "Implement a standalone, accessible user profile update form component (`ProfileUpdateForm.tsx`) using React, TypeScript, and Tailwind CSS. Requirements: Validate fullName, email, password, and avatar file upload (.jpg/.png <2MB). Use pure React hooks onBlur without external libraries like Yup or Zod. Add explicit aria-invalid and aria-describedby attributes."

### Prompt 3: Repository Refactoring & Bug Fix
> "Please fix the nested directory structure of this project. Move all files and hidden folders from inside the `my-app` directory directly into the project root (`flyrank-frontend-capstone`). After moving everything, delete the empty `my-app` folder and run `npm install`."

---

## 3. How AI Assisted Throughout Implementation

1. **Scaffolding & Boilerplate:** AI generated complex TypeScript interface definitions and Tailwind UI utility classes instantly.
2. **Accessibility Enforcement:** AI automatically injected `aria-describedby` links and dynamic `role="alert"` containers for screen readers.
3. **Automated Refactoring:** Cursor AI Agent executed shell commands to flatten the nested directory hierarchy (`my-app/` -> root) and resolved configuration paths across `package.json` and `tsconfig.json`.
4. **Test Verification:** AI wrote unit tests in Jest to ensure 9/9 assertions passed before deployment.

---

## 4. Manual Improvements & Code Review Corrections

While the AI provided a strong initial baseline, human code review and manual refactoring were crucial:

1. **Eliminated Unwanted Dependencies:** 
   - *AI Mistake:* AI initially attempted to import external validation schemas (`Yup`/`Zod`).
   - *Manual Fix:* Refactored form validation to use native TypeScript regex and `useState` handlers, keeping the bundle lightweight and dependency-free.

2. **Fixed Nested Directory Structure:**
   - *Issue:* The project was generated inside a nested `my-app/` folder, breaking root-level scripts and CI/CD pipelines.
   - *Manual Correction:* Guided the AI agent to flatten the workspace layout and verify `npm run dev` and `npm test` at the true root level.

3. **UX Edge Cases:**
   - *Manual Refinement:* Added logic to disable submit buttons during pending async API states and clear file input previews when invalid file formats are selected.
