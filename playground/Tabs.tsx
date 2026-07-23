"use client";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type TabItem = {
  id: string;
  label: string;
  panel: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
  ariaLabel: string;
};

export function Tabs({ items, defaultTabId, ariaLabel }: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const initialTabId = useMemo(() => {
    if (defaultTabId && items.some((item) => item.id === defaultTabId)) {
      return defaultTabId;
    }

    return items[0]?.id ?? "";
  }, [defaultTabId, items]);

  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const [focusedTabIndex, setFocusedTabIndex] = useState(() =>
    Math.max(
      0,
      items.findIndex((item) => item.id === initialTabId),
    ),
  );

  if (items.length === 0) {
    return null;
  }

  const focusTabAtIndex = (index: number) => {
    const normalizedIndex = (index + items.length) % items.length;
    setFocusedTabIndex(normalizedIndex);
    tabRefs.current[normalizedIndex]?.focus();
  };

  const activateTabAtIndex = (index: number) => {
    const normalizedIndex = (index + items.length) % items.length;
    const nextTab = items[normalizedIndex];

    if (!nextTab) {
      return;
    }

    setActiveTabId(nextTab.id);
    setFocusedTabIndex(normalizedIndex);
    tabRefs.current[normalizedIndex]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        activateTabAtIndex(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        activateTabAtIndex(index - 1);
        break;
      case "Home":
        event.preventDefault();
        activateTabAtIndex(0);
        break;
      case "End":
        event.preventDefault();
        activateTabAtIndex(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-700"
      >
        {items.map((item, index) => {
          const isSelected = item.id === activeTabId;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={focusedTabIndex === index ? 0 : -1}
              onClick={() => activateTabAtIndex(index)}
              onFocus={() => setFocusedTabIndex(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                (isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700")
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const isSelected = item.id === activeTabId;
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            tabIndex={0}
            className="pt-4 text-sm leading-7 text-slate-700 dark:text-slate-300"
          >
            {item.panel}
          </div>
        );
      })}
    </div>
  );
}
