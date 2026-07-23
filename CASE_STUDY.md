# Voice Card
Direct, technical, honest, no jargon, solution-focused.

---

# Case Study: FlyRank Frontend Capstone Project

## 1. The Problem
While developing a React/Next.js application, I faced two main challenges: a nested folder structure (`my-app` inside root) causing deployment and path issues, and an overly basic form component that lacked real-time validation, accessibility (a11y) standards, and clear UX feedback.

## 2. What I Did & What I Decided
- **Refactored Architecture:** Cleaned up the repository structure by flattening the nested `my-app` folder directly into the project root, fixing dependencies and scripts.
- **Precision AI Prompting:** Shifted from vague AI prompts to structured, constraint-heavy prompts requiring strict TypeScript interfaces, regex validation, WCAG accessibility compliance (`aria-describedby`, `role="alert"`), and real-time validation triggers (`onBlur`).
- **Edge Case Management:** Added custom file upload limits (2MB JPEG/PNG), password strength validation, and explicit loading states.

## 3. What Came of It
- All 9/9 Jest test suites passed cleanly with full build verification.
- Decreased code review effort significantly by generating production-ready components on the first AI attempt.
- Standardized project rules (`CLAUDE.md`) to guide future AI-assisted workflows.

---

# Before vs. After (Generic AI vs. My Voice)

* **Generic AI Version (Before):** 
> "In this project, I leveraged cutting-edge AI technologies to seamlessly integrate robust frontend validation and synergize application architecture for optimized developer velocity."

* **My Edited Version (After):** 
> "I restructured the repository to fix broken paths and used strict TypeScript and WCAG rules in my AI prompts to build a fully validated, accessible profile form."

---

# Bio & CTA
**Deniz Erdoğan** — Frontend Developer & Web Designer based in Ankara. I focus on clean code, accessible UI components, and efficient AI workflows.  
* **GitHub:** https://github.com/ALCUNE/flyrank-frontend-capstone  
* **Contact:** denizerdogan.web@gmail.com
