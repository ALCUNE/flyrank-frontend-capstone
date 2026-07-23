# Playground Notes — Custom Primitives vs shadcn/ui (Radix UI)

This document compares the Week 4 custom implementations in `playground/` with the behavior provided by **shadcn/ui**, which wraps **Radix UI** primitives.

---

## Modal (`playground/Modal.tsx`) vs `Dialog` (Radix / shadcn)

### What our custom modal does
- Renders with `role="dialog"` and `aria-modal="true"`.
- Traps focus with a manual `Tab` / `Shift+Tab` loop over focusable descendants.
- Closes on `Escape` and restores focus to the trigger via `returnFocusRef`.
- Portals content to `document.body` using React `createPortal`.
- Applies basic body scroll lock via `document.body.style.overflow = "hidden"`.

### What shadcn/ui + Radix adds
- **`DialogPortal`:** Radix mounts the overlay and content outside the React tree with consistent stacking context (`z-index`) and pointer-event isolation. Our portal is simpler and may require manual z-index tuning in complex layouts.
- **Focus scope engine:** Radix `@radix-ui/react-focus-scope` handles focus trapping with edge cases such as dynamically added/removed focusable nodes, hidden elements, and nested dialogs.
- **Initial focus restoration:** Radix tracks the previously focused element across nested open/close cycles and supports `onOpenAutoFocus` / `onCloseAutoFocus` overrides. Our implementation stores `document.activeElement` once on open and may miss updates if focus moves before the dialog paints.
- **Body scroll lock:** Radix uses a dedicated scroll-lock utility that preserves scrollbar gutter width and handles iOS overscroll quirks. Our one-line `overflow: hidden` approach can cause layout shift or fail on mobile Safari in nested scroll containers.
- **Outside interaction policy:** Radix distinguishes pointer-down vs focus events for outside dismiss behavior and supports modal vs non-modal modes. Our overlay click handler is always enabled and does not guard against accidental dismissal during text selection drags.

### Focus trapping mechanics (detailed)
Custom focus trap:
1. Query focusable elements inside the dialog container.
2. Intercept `Tab` at the document level.
3. Wrap from first to last (and reverse).

Radix focus trap additionally:
- Observes DOM mutations inside the scope.
- Respects `aria-hidden` subtrees.
- Supports nested focus scopes (dialog inside dialog, popover inside dialog).
- Prevents focus from escaping to browser chrome or sibling portals.

---

## Tabs (`playground/Tabs.tsx`) vs `Tabs` (Radix / shadcn)

### What our custom tabs do
- Implements `role="tablist"`, `role="tab"`, and `role="tabpanel"`.
- Sets `aria-selected` and pairs tabs to panels with `aria-controls`.
- Uses manual roving `tabIndex` (`0` on focused tab, `-1` on others).
- Supports `ArrowLeft`, `ArrowRight`, `Home`, and `End` with automatic activation.

### What shadcn/ui + Radix adds
- **Automatic roving tabindex:** Radix maintains roving focus across tabs with a centralized focus manager, including `ArrowUp`/`ArrowDown` for vertical orientations without extra branching.
- **Activation modes:** Radix supports manual activation (focus moves with arrows, selection requires `Enter`/`Space`) vs automatic activation via a prop. Our tabs always activate on arrow navigation.
- **Keyboard event normalization:** Radix normalizes behavior across browsers and prevents page scroll when arrow keys are used on horizontal tablists.
- **Lazy mounting options:** shadcn tabs can defer mounting inactive panels, preserving state or unmounting content depending on configuration. Our panels remain mounted and toggled with `hidden`.
- **Indicator / content measurement:** shadcn examples often include animated indicators sized by Radix layout measurements. Our implementation intentionally avoids layout effects for simplicity.

### Roving tabindex comparison
| Concern | Custom Tabs | Radix Tabs |
|--------|-------------|------------|
| Focus memory after mouse click | Manual `focusedTabIndex` state | Built-in roving focus manager |
| Vertical orientation | Not implemented | Supported via orientation prop |
| Manual activation pattern | Not supported | Supported |
| Tab panel focus on activate | Panel receives `tabIndex={0}` always | Configurable focus management |

---

## Disclosure (`playground/Disclosure.tsx`) vs `Collapsible` (Radix / shadcn)

### What our custom disclosure does
- Button trigger toggles `aria-expanded` and references panel via `aria-controls`.
- Panel visibility toggled with the `hidden` attribute.
- Uses semantic heading wrapper for the trigger label.

### What shadcn/ui + Radix adds
- **`Collapsible` state machine:** Radix exposes `data-state="open|closed"` hooks for animation and styling without relying on `hidden`.
- **Height animations:** shadcn collapsible recipes measure content height for smooth transitions. Our panel appears/disappears instantly.
- **Reduced motion handling:** Radix-aware examples often respect `prefers-reduced-motion`. Our disclosure does not alter motion behavior.
- **Id generation consistency:** Radix ensures stable ids across SSR/hydration. We use `useId()`, which is generally safe in React 19, but custom SSR edge cases still require careful testing.

---

## Edge-Case Keyboard Interactions Easy to Miss

When building lightweight primitives, these shadcn/Radix behaviors are commonly overlooked:

1. **Focus restoration timing:** Returning focus before the dialog unmount completes can fail silently. Radix schedules restoration on close animation end.
2. **Nested overlays:** Opening a select menu or nested dialog inside a modal requires nested focus scopes. A single manual trap breaks quickly.
3. **Scrollbar compensation:** Removing body scroll without compensating for scrollbar width causes horizontal layout jump.
4. **Inert / aria-hidden on background:** Modal backgrounds should mark the page behind as inert. Radix sets `aria-hidden` on sibling content; our modal only overlays visually.
5. **Tab panel focus policy:** Moving focus into the panel on activation vs keeping focus on the tab is an intentional UX choice. Radix documents both patterns; our tabs always allow panel focus via `tabIndex={0}`.
6. **Screen reader announcements:** Radix dialog titles/descriptions integrate with accessibility APIs consistently. Custom dialogs must ensure visible titles are referenced by `aria-labelledby` and remain present in the DOM while open.

---

## When to Use Custom vs shadcn/ui

**Use custom primitives when:**
- Learning WAI-ARIA contracts and keyboard models.
- Bundle size must stay minimal and requirements are narrow.
- The UI pattern is static and test coverage is strong.

**Use shadcn/ui / Radix when:**
- Shipping production interfaces with nested overlays, complex focus paths, or mobile edge cases.
- Teams need battle-tested accessibility behavior with configurable policies.
- Time-to-ship outweighs the cost of understanding primitive internals.

---

## Summary

Our playground components satisfy core ARIA roles and primary keyboard interactions for Modal, Tabs, and Disclosure. shadcn/ui (via Radix) goes further by providing portal layering, mutation-aware focus scopes, scroll locking, nested dialog support, orientation-aware roving tabindex, and configurable activation/focus policies—edge cases that are easy to miss in lightweight custom implementations.
