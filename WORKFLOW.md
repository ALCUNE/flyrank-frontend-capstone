# FE-D2: AI-Assisted Workflow Drill Report

This document details the comparative analysis between two different development approaches utilized to build a **Variant Option Creation Form** component in React and Tailwind CSS.

---

## 🟢 Round 1: Vague Prompting (The Lazy Approach)

* **Branch:** `workflow-drill-v1`

* **Prompt used:** *"Create a variant option creation form with input fields for option name and multiple values in React with Tailwind."*

### Analysis of the Output:

The generated component was superficially functional but severely lacked the robust characteristics required for an enterprise application. 

* **State & Performance:** The state was managed using a basic `useState` array. Every keypress inside a value input caused a complete re-render of the entire form and all sibling inputs, resulting in zero rendering optimization.

* **Validation Deficiencies:** It had primitive validation (only checking if fields were empty). Whitespaces were not properly trimmed, allowing empty strings with spaces (e.g., `"   "`) to bypass validation. Furthermore, it completely ignored **duplicate value protection**—allowing the user to add "M" multiple times, which would corrupt the product variation matrix downstream.

* **Accessibility (A11y):** Accessibility was practically non-existent. No ARIA roles, no keyboard interactions (keyboard users had to manually click "Add" with a mouse), and no dynamic screen-reader announcements for newly added/removed options.

---

## 🔵 Round 2: Precise, Plan-Based Prompting (The Lead Engineer Approach)

* **Branch:** `workflow-drill-v2`

* **Prompt used:** A highly detailed specification enforcing strict technical constraints, state separation, error diagnostics, edge-case constraints (1-10 values), keyboard navigation, and custom focus management.

### Analysis of the Output:

The differences in code quality, stability, and structure were night and day.

* **Architectural Superiority:** Instead of simple state, it implemented a strict `useReducer` to manage complex action types `ADD_ROW`, `REMOVE_ROW`, `UPDATE_VALUE`). Sub-components like `OptionNameField` and `ValueRow` were wrapped in `React.memo` and used stable callbacks, completely preventing redundant re-renders of sibling elements.

* **Air-Tight Validation:** Multi-level validation was implemented natively. Duplicate values are flagged instantly on-change (using a case-insensitive, whitespace-trimmed algorithm) and the submission pipeline is strictly blocked.

* **Exceptional UX & Focus Management:** It correctly utilized `requestAnimationFrame` alongside stable element keys to instantly shift focus to newly created fields. Backspace on empty rows triggers automated deletion and focuses on the adjacent input naturally.

* **Complete Accessibility compliance:** The layout is fully wrapped in semantic `<fieldset>` and `<legend>` elements. Screen readers are continuously kept updated via `aria-live="polite"` and `aria-invalid` triggers, making the form completely keyboard-navigable and inclusive.

---

## 🧠 Key Learnings & AI Failures Caught

During the drill, one major AI mistake was caught and manually rectified:

1. **The Native Focus Trap Bug:** In Round 2, the AI initially attempted to shift focus immediately after updating the state. However, because React had not yet finished flushing the DOM updates (the new row didn't exist in the DOM at the exact millisecond of the focus call), the focus fell back to the `document.body` or stayed on the button. 

2. **The Fix:** I instructed the AI to handle this asynchronously by putting the focus targeting inside a `requestAnimationFrame` (or `setTimeout` fallback), ensuring the DOM was fully painted before focusing the input field.

---

## ⚙️ Core Rules Added to [CLAUDE.md](http://CLAUDE.md)

Based on this drill, the following three katas have been registered into our `CLAUDE.md` to guarantee future code generation aligns with high-engineering standards:

1. **Rule 1: No Ghost Renders in Dynamic Lists**

   * *Requirement:* Any dynamic list component (such as forms or tables) must utilize memoized sub-items `React.memo`) and stable callback handlers `(id, rawValue) => void` to prevent cascading sibling re-renders on keystrokes.

2. **Rule 2: Keyboard First for Interactive UI**

   * *Requirement:* Interactive forms with dynamic rows must support full keyboard navigation (e.g., `Enter` to create/focus next, `Backspace` on empty inputs to safely destroy the row), backed by explicit focus management using `requestAnimationFrame` to target freshly painted DOM elements.

3. **Rule 3: Air-tight Input Validation Hygiene**

   * *Requirement:* Never rely on basic empty string checks. Always trim whitespaces before evaluation, implement instant duplicate detection (case-insensitive) on composite array values, and completely block submission pipelines if validation states fail.