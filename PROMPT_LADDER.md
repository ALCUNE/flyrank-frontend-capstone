# The Prompt Ladder — Assignment Submission

## Baseline (Weak Prompt)
> "Write a profile update form in React."

---

## Step 1: Baseline Output (Vague)
- **Output Excerpt:** A single, simplistic component with basic HTML inputs and zero state management or error handling.
- **Notes:**
  - *What changed in prompt:* None (baseline).
  - *What actually improved:* Generated basic JSX skeleton.
  - *What still failed:* No validation, no TypeScript types, no styling, unusable in production.
  - *What I would try next:* Add explicit technology constraints (TypeScript & Tailwind CSS).

---

## Step 2: Version 1 — Layer Added: Technology Constraints
> **Prompt:** "Write a user profile update form component in React using TypeScript and Tailwind CSS."
- **Notes:**
  - *What changed in prompt:* Added tech stack constraints (TypeScript, Tailwind CSS).
  - *What actually improved:* Output added type definitions for form state and modern Tailwind styling.
  - *What still failed:* Form accepted invalid inputs (no regex or field rules).
  - *What I would try next:* Define explicit field-level validation rules.

---

## Step 3: Version 2 — Layer Added: Field Validation Rules
> **Prompt:** "Write a user profile update form component in React using TypeScript and Tailwind CSS. Fields: fullName (req, min 3 chars), email (valid regex), password (optional, min 8 chars with uppercase/number), confirmPassword (must match password)."
- **Notes:**
  - *What changed in prompt:* Specified required fields and validation rules.
  - *What actually improved:* Added inline state validation and conditional error messages below inputs.
  - *What still failed:* Validation triggered on every keystroke aggressively, ruining UX.
  - *What I would try next:* Specify event triggers and UX behavior.

---

## Step 4: Version 3 — Layer Added: UX Behavior & Event Triggers
> **Prompt:** "Write a user profile update form component in React using TypeScript and Tailwind CSS. Fields: fullName, email, password, confirmPassword with validation rules. Validate fields onBlur or onSubmit. Show submission loading spinner and success alert."
- **Notes:**
  - *What changed in prompt:* Added trigger mechanisms (`onBlur`) and submission UX states.
  - *What actually improved:* Form stopped nagging user while typing; added loading spinner state during async mock submission.
  - *What still failed:* **(Honest Failure Moment)** The AI attempted to import `yup` and `@hookform/resolvers` without asking, introducing uninstalled dependencies to the codebase.
  - *What I would try next:* Add explicit architectural constraints (no external validation libraries).

---

## Step 5: Version 4 — Layer Added: Architectural Constraints
> **Prompt:** "Write a standalone user profile update form component in React using TypeScript and Tailwind CSS. Validate fields onBlur using pure React useState hooks (no external libraries like Yup or Zod). Handle file uploads for avatars (.jpg/.png under 2MB)."
- **Notes:**
  - *What changed in prompt:* Restricted external library usage and added file size/type constraints.
  - *What actually improved:* Clean, dependency-free React code that compiles out-of-the-box in any project.
  - *What still failed:* Inaccessible to screen readers (missing `aria` tags).
  - *What I would try next:* Add accessibility (a11y) standards.

---

## Step 6: Version 5 — Layer Added: Accessibility (WCAG Criteria)
> **Prompt:** "Write a standalone, accessible user profile update form component (`ProfileUpdateForm.tsx`) in React, TypeScript, and Tailwind CSS. Use pure React state validation onBlur. Ensure full WCAG compliance: all inputs must have associated labels, `aria-invalid`, `aria-describedby` linking to error badges, and error messages must use `role="alert"`."
- **Notes:**
  - *What changed in prompt:* Added WCAG accessibility directives.
  - *What actually improved:* Screen readers can now capture errors instantly; form meets production accessibility standards.
  - *What still failed:* Nothing. Output is complete, type-safe, accessible, and robust.

---

## Final Reusable Prompt Template
```markdown
Implement a standalone, accessible user profile update form component (`ProfileUpdateForm.tsx`) using React, TypeScript, and Tailwind CSS.

Requirements:
1. Validation Rules:
   - Full Name: Required, min 3 chars.
   - Email: Valid regex pattern.
   - Password: Optional; if provided, min 8 chars with 1 uppercase, 1 lowercase, 1 number.
   - Confirm Password: Must match password if filled.
   - Avatar: Accept .jpg/.png under 2MB.
2. Architecture & Behavior:
   - Use pure React state hooks (`useState`) without external validation libraries (no Yup/Zod).
   - Trigger field validation `onBlur` or `onSubmit`.
   - Show loading spinner on submit and success banner upon completion.
3. Accessibility:
   - Include `aria-invalid`, `aria-describedby` linked to error containers, and `role="alert"` on error badges.
