import { suggestedPrompts, type SuggestedPrompt } from "@/lib/chat-types";

type PromptChipsProps = {
  disabled: boolean;
  onSelect: (message: string) => void;
  grouped?: boolean;
};

const promptGroups: Array<{ title: string; filter: (prompt: SuggestedPrompt) => boolean }> = [
  {
    title: "Tools",
    filter: (prompt) => prompt.id.startsWith("audit-"),
  },
  {
    title: "Recovery demo",
    filter: (prompt) => prompt.id.includes("error") || prompt.id.includes("mid-stream"),
  },
  {
    title: "Learning",
    filter: (prompt) => !prompt.id.startsWith("audit-") && !prompt.id.includes("error") && !prompt.id.includes("mid-stream"),
  },
];

function ChipButton({
  prompt,
  disabled,
  onSelect,
}: {
  prompt: SuggestedPrompt;
  disabled: boolean;
  onSelect: (message: string) => void;
}) {
  const isDestructive = prompt.id.includes("error") || prompt.id.includes("mid-stream");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(prompt.message)}
      className={
        "rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:text-sm " +
        (isDestructive
          ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:border-red-800"
          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-white hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300")
      }
    >
      {prompt.label}
    </button>
  );
}

export function PromptChips({ disabled, onSelect, grouped = false }: PromptChipsProps) {
  if (!grouped) {
    return (
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <ChipButton key={prompt.id} prompt={prompt} disabled={disabled} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {promptGroups.map((group) => {
        const prompts = suggestedPrompts.filter(group.filter);
        if (prompts.length === 0) {
          return null;
        }

        return (
          <div key={group.title} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {group.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <ChipButton key={prompt.id} prompt={prompt} disabled={disabled} onSelect={onSelect} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
