"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Disclosure } from "@/playground/Disclosure";
import { Modal } from "@/playground/Modal";
import { Tabs } from "@/playground/Tabs";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Week 4 Assignment
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Accessible Component Playground</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Custom React + TypeScript implementations of Modal, Tabs, and Disclosure patterns
            built without external UI libraries. Use keyboard navigation to test focus management
            and ARIA behavior.
          </p>
          <nav aria-label="Playground navigation">
            <Link
              href="/"
              className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 sm:px-6">
        <section
          aria-labelledby="modal-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 id="modal-heading" className="text-xl font-semibold">
            Modal
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Opens a dialog with focus trap, Escape-to-close, and focus restoration to the trigger.
          </p>

          <button
            ref={modalTriggerRef}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Open Accessible Modal
          </button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Profile Preferences"
            description="This dialog demonstrates WAI-ARIA dialog semantics with trapped focus."
            returnFocusRef={modalTriggerRef}
          >
            <p>
              Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">Tab</kbd>{" "}
              to cycle focus inside the dialog, or{" "}
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">Escape</kbd>{" "}
              to close and return focus to the trigger button.
            </p>
            <label className="mt-4 block text-sm font-medium">
              Display name
              <input
                type="text"
                defaultValue="Deniz Erdoğan"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-950"
              />
            </label>
          </Modal>
        </section>

        <section
          aria-labelledby="tabs-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 id="tabs-heading" className="text-xl font-semibold">
            Tabs
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Use Arrow Left/Right, Home, and End to navigate tabs with proper ARIA roles.
          </p>

          <div className="mt-4">
            <Tabs
              ariaLabel="Capstone feature overview"
              defaultTabId="validation"
              items={[
                {
                  id: "validation",
                  label: "Validation",
                  panel: (
                    <p>
                      The profile form validates on blur using pure React state, regex email
                      checks, password strength rules, and avatar file constraints.
                    </p>
                  ),
                },
                {
                  id: "accessibility",
                  label: "Accessibility",
                  panel: (
                    <p>
                      Inputs expose `aria-invalid`, `aria-describedby`, and error regions with
                      `role="alert"` so assistive technologies announce validation feedback.
                    </p>
                  ),
                },
                {
                  id: "architecture",
                  label: "Architecture",
                  panel: (
                    <p>
                      The repository uses a flattened Next.js App Router structure with reusable
                      components, Jest tests, and Tailwind CSS utility styling.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section
          aria-labelledby="disclosure-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 id="disclosure-heading" className="text-xl font-semibold">
            Disclosure
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Expandable sections with `aria-expanded` and `aria-controls` bindings on the trigger.
          </p>

          <div className="mt-4 space-y-3">
            <Disclosure title="Why build custom primitives instead of using shadcn/ui?">
              Building from scratch clarifies the underlying WAI-ARIA contracts and exposes the
              edge cases that libraries like Radix UI handle automatically.
            </Disclosure>
            <Disclosure title="What keyboard interactions should be tested?" defaultOpen>
              Modal: Tab cycle and Escape. Tabs: Arrow keys, Home, and End. Disclosure: Enter and
              Space on the trigger button to toggle panel visibility.
            </Disclosure>
            <Disclosure title="What is documented in playground/NOTES.md?">
              A comparison of focus trapping, portal rendering, roving tabindex behavior, and other
              shadcn/ui conveniences that lightweight custom implementations may omit.
            </Disclosure>
          </div>
        </section>
      </main>
    </div>
  );
}
