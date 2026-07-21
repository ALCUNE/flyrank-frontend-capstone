# AI-Assisted Workflow Drill: Reflection & Comparison

## Executive Summary
This document analyzes the differences between two software development workflows:
1. **Round One (Vague/Lazy Prompting):** Requesting a feature with minimal context and specifications.
2. **Round Two (Precise/Constrained Prompting):** Providing structured rules, explicit validation constraints, accessibility criteria, and verification steps.

The feature built for this comparison is the **User Profile Update Form** component.

---

## Code Diff Analysis & Comparison

### 1. Correctness & Form Validation
* **Round One:** The AI generated a basic form layout with standard HTML `required` attributes and minimal inline state. It lacked robust email regex validation, client-side password strength checks, confirm password matching logic, and file format/size checks for avatar uploads.
* **Round Two:** The AI provided real-time field-level validation (`onBlur` and `onChange`), regex pattern checking for emails, strong password criteria (uppercase, lowercase, digits), matching validation between password fields, and strict file constraints (JPEG/PNG under 2MB).

### 2. Accessibility (a11y)
* **Round One:** Form inputs had basic labels, but lacked proper accessibility bindings such as `aria-invalid`, `aria-describedby`, or dynamic error alerts (`role="alert"`).
* **Round Two:** Full compliance with WCAG standards. Input fields correctly reference error containers via `aria-describedby`, error badges carry `role="alert"` for screen reader capture, and focus states are clearly styled.

### 3. Edge Cases & UX States
* **Round One:** No loading spinner or disabled submit state during asynchronous requests. Errors were unformatted or missing context.
* **Round Two:** Handled edge cases effectively, including file upload size limits, real-time avatar previews, submission loading states with animated spinners, and clear success feedback notifications.

### 4. Review Effort & Time Efficiency
* **Round One Effort:** Required heavy manual code modification, adding missing TypeScript types, manual regex setup, and writing additional CSS rules. Total time end-to-end was longer due to fixing gaps.
* **Round Two Effort:** Initial prompt creation took ~2 minutes longer, but output code was production-ready on the first pass, requiring zero code fixes and only visual verification.

---

## AI Mistake Caught During Review

During the first iteration of the second prompt, the AI attempted to use an unimported third-party library (`yup`/`zod`) despite the project setup relying on standard React hooks and native TypeScript types. 

**Resolution:** Updated the prompt constraints to explicitly request standalone React state validation without external validation library dependencies.

---

## Updated Project Rules (`CLAUDE.md` / AI Rules)

To ensure consistency in future capstone assignments, the following rules are established:

1. **Form Validation Standard:** Always use explicit regex patterns and real-time validation triggers (`onBlur`) for text inputs; never rely solely on native HTML5 inputs.
2. **Accessibility Mandate:** Every dynamic form element must include `aria-invalid`, `aria-describedby` linking to error containers, and `role="alert"` on message badges.
3. **Async State Handling:** Every submit action must handle pending states explicitly by disabling the trigger button and rendering a loading indicator.
