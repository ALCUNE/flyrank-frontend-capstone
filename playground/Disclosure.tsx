"use client";

import { useId, useState, type ReactNode } from "react";

export type DisclosureProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const baseId = useId();
  const buttonId = `${baseId}-button`;
  const panelId = `${baseId}-panel`;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((previous) => !previous)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
        >
          <span>{title}</span>
          <span aria-hidden="true" className="text-slate-500 dark:text-slate-400">
            {isOpen ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="border-t border-slate-200 px-4 py-3 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:text-slate-300"
      >
        {children}
      </div>
    </div>
  );
}
