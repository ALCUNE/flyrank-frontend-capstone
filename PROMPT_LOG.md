# Prompting Fundamentals on Real Tasks v2 (FL-02)

## 1. Target Task
Refactoring a React/Next.js frontend repository structure and generating production-ready, accessible UI components with full TypeScript validation.

---

## 2. Naive (One-Line) Prompt
> "Refactor my React project structure and create a profile update form."

* **Naive Output:** Basic HTML form with inline states, generic CSS, and no folder reorganization steps.

---

## 3. Iteration Log (5 Engineering Techniques Applied)

### Iteration 1 — Technique: Role Assignment
> **Prompt:** "You are a Senior Principal Frontend Architect specializing in React, Next.js, and WCAG accessibility standards. Refactor my React project structure and create a profile update form."
- **Observed Difference:** Output tone shifted immediately towards enterprise-grade patterns, using modular component separation and strict interface definitions.

### Iteration 2 — Technique: Context & Motivation
> **Prompt:** "You are a Senior Principal Frontend Architect. My project currently has an unwanted nested directory structure (`my-app` inside root) that breaks automated deployment scripts, and an unvalidated profile form. We need a clean root repository setup and a production-ready form to meet strict internship quality checks."
- **Observed Difference:** The model prioritized fixing root configuration files (`package.json`, `tsconfig.json`) first before writing the UI component.

### Iteration 3 — Technique: Step Decomposition
> **Prompt:** "You are a Senior Principal Frontend Architect. [Context attached]. Perform this task in explicit sequential steps: 1) Flatten the folder structure from `my-app/` to project root. 2) Clean dependencies and run `npm install`. 3) Implement `ProfileUpdateForm.tsx` with field validation onBlur. 4) Run Jest unit tests to verify."
- **Observed Difference:** Stopped generating huge all-in-one code blocks. Instead, provided clean terminal commands step-by-step followed by isolated component code, making execution error-free.

### Iteration 4 — Technique: Output Structure (XML/Markdown Constraints)
> **Prompt:** "You are a Senior Principal Frontend Architect. [Context & Steps attached]. Format your response strictly using Markdown sections: `## Directory Commands`, `## TypeScript Interfaces`, `## React Component Code`, and `## Verification Checklist`. Do not include conversational filler."
- **Observed Difference:** Eliminated unnecessary conversational prose. Output became immediately copy-pasteable and scannable for review.

### Iteration 5 — Technique: Few-Shot Examples & Negative Constraints
> **Prompt:** "You are a Senior Principal Frontend Architect. [Context, Steps, Structure attached]. 
Constraint: DO NOT use external validation libraries like Yup or Zod; use pure React hooks. 
Example of expected accessibility error markup:
`<p id='email-error' role='alert' className='text-red-600'>{errors.email}</p>`"
- **Observed Difference:** Code stayed strictly dependency-free while achieving 100% WCAG compliance (`aria-describedby`, `role='alert'`).

---

## 4. Cross-Model Comparison (Claude vs ChatGPT)

* **Claude (3.5 Sonnet / Composer):** 
  - *Tone & Precision:* Highly structured, respected negative constraints flawlessly (did not add Yup/Zod), and executed directory moves via shell commands accurately.
  - *Failure Points:* Can be overly cautious on file deletion steps, requiring explicit manual confirmation prompts.

* **ChatGPT (GPT-4o):** 
  - *Tone & Precision:* Excellent explanations and comments inside code blocks, but tended to re-introduce third-party library recommendations despite explicit negative constraints.
  - *Failure Points:* Missed a few edge-case TypeScript definitions for event handlers (`ChangeEvent<HTMLInputElement>`) unless explicitly reminded.

---

## 5. Final Reusable Prompt Template
```markdown
Role: You are a Senior Frontend Architect.
Task: Implement [Feature Name] in React/Next.js with TypeScript and Tailwind CSS.

Execution Steps:
1. Define TypeScript types/interfaces for state and errors.
2. Build standalone component using pure React hooks (no external form libraries).
3. Apply validation triggers on `onBlur`.
4. Ensure WCAG compliance (`aria-invalid`, `aria-describedby`, `role="alert"`).

Output Structure:
- ## Types
- ## Component Code
- ## Verification Checklist
