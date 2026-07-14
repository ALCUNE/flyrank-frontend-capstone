"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type RefCallback,
} from "react";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type VariantOption = {
  name: string;
  values: string[];
};

export type VariantFormProps = {
  onSubmit?: (option: VariantOption) => void;
  initialOption?: VariantOption;
  className?: string;
};

// ---------------------------------------------------------------------------
// Internal types & constants
// ---------------------------------------------------------------------------

const MAX_NAME_LENGTH = 30;
const MIN_VALUES = 1;
const MAX_VALUES = 10;

type ValueItem = {
  id: string;
  raw: string;
};

type FormErrors = {
  name?: string;
  values?: string;
  byValueId: Record<string, string>;
};

type FormState = {
  optionName: string;
  values: ValueItem[];
  errors: FormErrors;
  touched: {
    name: boolean;
    valueIds: Set<string>;
  };
  submitAttempted: boolean;
  announcerMessage: string;
  focusTargetId: string | null;
};

type FormAction =
  | { type: "SET_OPTION_NAME"; payload: string }
  | { type: "SET_VALUE"; payload: { id: string; raw: string } }
  | { type: "ADD_VALUE" }
  | { type: "REMOVE_VALUE"; payload: { id: string } }
  | { type: "BLUR_NAME" }
  | { type: "BLUR_VALUE"; payload: { id: string } }
  | { type: "SUBMIT_ATTEMPT" }
  | { type: "CLEAR_ANNOUNCER" }
  | { type: "CLEAR_FOCUS_TARGET" }
  | { type: "RESET"; payload: VariantOption | undefined };

const EMPTY_ERRORS: FormErrors = { byValueId: {} };

const INPUT_CLASSNAME =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

// ---------------------------------------------------------------------------
// Pure utilities
// ---------------------------------------------------------------------------

function createValueId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `value-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createValueItem(raw = ""): ValueItem {
  return { id: createValueId(), raw };
}

function createInitialState(initialOption?: VariantOption): FormState {
  const values =
    initialOption?.values.length && initialOption.values.length > 0
      ? initialOption.values.map((raw) => createValueItem(raw))
      : [createValueItem()];

  const state: FormState = {
    optionName: initialOption?.name ?? "",
    values,
    errors: EMPTY_ERRORS,
    touched: { name: false, valueIds: new Set() },
    submitAttempted: false,
    announcerMessage: "",
    focusTargetId: null,
  };

  return {
    ...state,
    errors: validateVariantForm(state, { strict: true }),
  };
}

function findDuplicateValueIds(values: ValueItem[]): Set<string> {
  const buckets = new Map<string, string[]>();

  for (const item of values) {
    const normalized = item.raw.trim().toLowerCase();
    if (!normalized) {
      continue;
    }
    const existing = buckets.get(normalized) ?? [];
    existing.push(item.id);
    buckets.set(normalized, existing);
  }

  const duplicateIds = new Set<string>();
  for (const ids of buckets.values()) {
    if (ids.length > 1) {
      ids.forEach((id) => duplicateIds.add(id));
    }
  }

  return duplicateIds;
}

function hasBlockingErrors(errors: FormErrors): boolean {
  if (errors.name || errors.values) {
    return true;
  }
  return Object.keys(errors.byValueId).length > 0;
}

function validateVariantForm(
  state: Pick<FormState, "optionName" | "values" | "touched" | "submitAttempted">,
  options: { strict: boolean },
): FormErrors {
  const errors: FormErrors = { byValueId: {} };
  const trimmedName = state.optionName.trim();
  const showNameErrors =
    options.strict || state.touched.name || state.submitAttempted;

  if (
    !trimmedName &&
    (showNameErrors || state.optionName.length > 0)
  ) {
    errors.name = "Option name is required.";
  } else if (trimmedName.length > MAX_NAME_LENGTH) {
    errors.name = `Option name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  }

  const duplicateIds = findDuplicateValueIds(state.values);
  const nonEmptyCount = state.values.filter((item) => item.raw.trim()).length;

  const showGroupValueErrors =
    options.strict ||
    state.submitAttempted ||
    state.touched.valueIds.size > 0;

  if (showGroupValueErrors && nonEmptyCount < MIN_VALUES) {
    errors.values = `Add at least ${MIN_VALUES} value.`;
  }

  for (const item of state.values) {
    const trimmed = item.raw.trim();
    const showRowErrors =
      options.strict ||
      state.submitAttempted ||
      state.touched.valueIds.has(item.id);

    if (duplicateIds.has(item.id)) {
      errors.byValueId[item.id] = "This value is already used.";
      continue;
    }

    if (showRowErrors && !trimmed) {
      errors.byValueId[item.id] = "Value cannot be empty.";
    }
  }

  return errors;
}

function trimStateValues(values: ValueItem[]): ValueItem[] {
  return values.map((item) => ({ ...item, raw: item.raw.trim() }));
}

function revalidateState(state: FormState, strict: boolean): FormState {
  return {
    ...state,
    errors: validateVariantForm(state, { strict }),
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function variantFormReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_OPTION_NAME": {
      const next = revalidateState(
        { ...state, optionName: action.payload },
        false,
      );
      return next;
    }

    case "SET_VALUE": {
      const nextValues = state.values.map((item) =>
        item.id === action.payload.id
          ? { ...item, raw: action.payload.raw }
          : item,
      );
      const next = revalidateState({ ...state, values: nextValues }, false);
      return next;
    }

    case "ADD_VALUE": {
      if (state.values.length >= MAX_VALUES) {
        return state;
      }

      const newItem = createValueItem();
      const nextValues = [...state.values, newItem];

      return revalidateState(
        {
          ...state,
          values: nextValues,
          announcerMessage: `Value ${nextValues.length} added.`,
          focusTargetId: newItem.id,
        },
        false,
      );
    }

    case "REMOVE_VALUE": {
      if (state.values.length <= MIN_VALUES) {
        return state;
      }

      const removeIndex = state.values.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (removeIndex === -1) {
        return state;
      }

      const nextValues = state.values.filter(
        (item) => item.id !== action.payload.id,
      );
      const focusIndex = removeIndex > 0 ? removeIndex - 1 : 0;
      const focusTargetId = nextValues[focusIndex]?.id ?? null;

      return revalidateState(
        {
          ...state,
          values: nextValues,
          announcerMessage: `Value ${removeIndex + 1} removed.`,
          focusTargetId,
        },
        false,
      );
    }

    case "BLUR_NAME": {
      const nextTouched = { ...state.touched, name: true };
      return revalidateState(
        {
          ...state,
          optionName: state.optionName.trim(),
          touched: nextTouched,
        },
        false,
      );
    }

    case "BLUR_VALUE": {
      const nextValues = state.values.map((item) =>
        item.id === action.payload.id
          ? { ...item, raw: item.raw.trim() }
          : item,
      );
      const nextTouched = {
        ...state.touched,
        valueIds: new Set(state.touched.valueIds).add(action.payload.id),
      };

      return revalidateState(
        { ...state, values: nextValues, touched: nextTouched },
        false,
      );
    }

    case "SUBMIT_ATTEMPT": {
      const trimmedValues = trimStateValues(state.values);
      const trimmedState: FormState = {
        ...state,
        optionName: state.optionName.trim(),
        values: trimmedValues,
        submitAttempted: true,
        touched: {
          name: true,
          valueIds: new Set(trimmedValues.map((item) => item.id)),
        },
      };

      const errors = validateVariantForm(trimmedState, { strict: true });
      return {
        ...trimmedState,
        errors,
        announcerMessage: hasBlockingErrors(errors)
          ? "Form has errors. Please review the highlighted fields."
          : "",
      };
    }

    case "CLEAR_ANNOUNCER":
      return { ...state, announcerMessage: "" };

    case "CLEAR_FOCUS_TARGET":
      return { ...state, focusTargetId: null };

    case "RESET":
      return createInitialState(action.payload);

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Memoized subcomponents
// ---------------------------------------------------------------------------

type OptionNameFieldProps = {
  value: string;
  error?: string;
  showCounter: boolean;
  inputRef: RefCallback<HTMLInputElement>;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const OptionNameField = memo(function OptionNameField({
  value,
  error,
  showCounter,
  inputRef,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
}: OptionNameFieldProps) {
  const describedBy = [
    error ? "option-name-error" : null,
    showCounter ? "option-name-counter" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <label
        htmlFor="option-name"
        className="block text-sm font-medium text-gray-700"
      >
        Option name
      </label>
      <input
        ref={inputRef}
        id="option-name"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder="e.g. Size, Color, Material"
        maxLength={MAX_NAME_LENGTH + 10}
        className={INPUT_CLASSNAME}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
      />
      {showCounter ? (
        <p
          id="option-name-counter"
          className="text-xs text-gray-500"
          aria-live="off"
        >
          {value.trim().length} / {MAX_NAME_LENGTH}
        </p>
      ) : null}
      {error ? (
        <p id="option-name-error" className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

type ValueRowProps = {
  id: string;
  index: number;
  value: string;
  error?: string;
  canRemove: boolean;
  onChange: (id: string, raw: string) => void;
  onBlur: (id: string) => void;
  onRemove: (id: string) => void;
  onKeyDown: (id: string, index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  registerInputRef: (id: string) => RefCallback<HTMLInputElement>;
};

const ValueRow = memo(function ValueRow({
  id,
  index,
  value,
  error,
  canRemove,
  onChange,
  onBlur,
  onRemove,
  onKeyDown,
  registerInputRef,
}: ValueRowProps) {
  const errorId = `value-error-${id}`;

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <input
          ref={registerInputRef(id)}
          id={`value-${id}`}
          type="text"
          value={value}
          onChange={(event) => onChange(id, event.target.value)}
          onBlur={() => onBlur(id)}
          onKeyDown={(event) => onKeyDown(id, index, event)}
          placeholder={`Value ${index + 1}`}
          className={INPUT_CLASSNAME}
          aria-label={`Value ${index + 1}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          onClick={() => onRemove(id)}
          disabled={!canRemove}
          className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Remove value ${index + 1}`}
          aria-disabled={!canRemove}
        >
          Remove
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

type FormAnnouncerProps = {
  message: string;
};

const FormAnnouncer = memo(function FormAnnouncer({ message }: FormAnnouncerProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
});

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

export default function VariantForm({
  onSubmit,
  initialOption,
  className = "",
}: VariantFormProps) {
  const [state, dispatch] = useReducer(
    variantFormReducer,
    initialOption,
    createInitialState,
  );

  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [nameFocused, setNameFocused] = useReducer(
    (_: boolean, next: boolean) => next,
    false,
  );

  const registerNameInputRef = useCallback<RefCallback<HTMLInputElement>>(
    (element) => {
      nameInputRef.current = element;
    },
    [],
  );

  const strictErrors = useMemo(
    () => validateVariantForm(state, { strict: true }),
    [state.optionName, state.values],
  );

  const isSubmitDisabled = useMemo(
    () => hasBlockingErrors(strictErrors),
    [strictErrors],
  );

  const registerInputRef = useCallback(
    (id: string): RefCallback<HTMLInputElement> =>
      (element) => {
        if (element) {
          inputRefs.current.set(id, element);
        } else {
          inputRefs.current.delete(id);
        }
      },
    [],
  );

  const focusValueInput = useCallback((id: string) => {
    requestAnimationFrame(() => {
      inputRefs.current.get(id)?.focus();
    });
  }, []);

  useEffect(() => {
    if (!state.focusTargetId) {
      return;
    }

    focusValueInput(state.focusTargetId);
    dispatch({ type: "CLEAR_FOCUS_TARGET" });
  }, [state.focusTargetId, focusValueInput]);

  useEffect(() => {
    if (!state.announcerMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: "CLEAR_ANNOUNCER" });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [state.announcerMessage]);

  const handleOptionNameChange = useCallback((value: string) => {
    dispatch({ type: "SET_OPTION_NAME", payload: value });
  }, []);

  const handleOptionNameBlur = useCallback(() => {
    dispatch({ type: "BLUR_NAME" });
  }, []);

  const handleOptionNameKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const firstValueId = state.values[0]?.id;
        if (firstValueId) {
          focusValueInput(firstValueId);
        }
      }
    },
    [state.values, focusValueInput],
  );

  const handleValueChange = useCallback((id: string, raw: string) => {
    dispatch({ type: "SET_VALUE", payload: { id, raw } });
  }, []);

  const handleValueBlur = useCallback((id: string) => {
    dispatch({ type: "BLUR_VALUE", payload: { id } });
  }, []);

  const handleValueRemove = useCallback((id: string) => {
    dispatch({ type: "REMOVE_VALUE", payload: { id } });
  }, []);

  const handleValueKeyDown = useCallback(
    (id: string, index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const isLastRow = index === state.values.length - 1;
        if (isLastRow) {
          if (state.values.length < MAX_VALUES) {
            dispatch({ type: "ADD_VALUE" });
          }
          return;
        }

        const nextId = state.values[index + 1]?.id;
        if (nextId) {
          focusValueInput(nextId);
        }
        return;
      }

      if (event.key === "Backspace" && event.currentTarget.value === "") {
        if (state.values.length <= MIN_VALUES) {
          return;
        }

        event.preventDefault();
        dispatch({ type: "REMOVE_VALUE", payload: { id } });
      }
    },
    [state.values, focusValueInput],
  );

  const handleAddValue = useCallback(() => {
    dispatch({ type: "ADD_VALUE" });
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({ type: "SUBMIT_ATTEMPT" });

    const trimmedName = state.optionName.trim();
    const trimmedValues = trimStateValues(state.values);
    const validationState = {
      optionName: trimmedName,
      values: trimmedValues,
      touched: {
        name: true,
        valueIds: new Set(trimmedValues.map((item) => item.id)),
      },
      submitAttempted: true,
    };
    const nextErrors = validateVariantForm(validationState, { strict: true });

    if (hasBlockingErrors(nextErrors)) {
      requestAnimationFrame(() => {
        if (nextErrors.name) {
          nameInputRef.current?.focus();
          return;
        }

        for (const item of trimmedValues) {
          if (nextErrors.byValueId[item.id]) {
            focusValueInput(item.id);
            return;
          }
        }
      });
      return;
    }

    onSubmit?.({
      name: trimmedName,
      values: trimmedValues.map((item) => item.raw).filter(Boolean),
    });
  };

  const valuesCount = state.values.length;
  const canAddValue = valuesCount < MAX_VALUES;
  const fieldsetDescribedBy = state.errors.values
    ? "values-group-error values-count-hint"
    : "values-count-hint";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`mx-auto w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <FormAnnouncer message={state.announcerMessage} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Create Variant Option
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Define an option such as Size or Color, then add one or more values.
        </p>
      </div>

      <OptionNameField
        value={state.optionName}
        error={state.errors.name}
        showCounter={nameFocused || Boolean(state.errors.name)}
        inputRef={registerNameInputRef}
        onChange={handleOptionNameChange}
        onFocus={() => setNameFocused(true)}
        onBlur={() => {
          setNameFocused(false);
          handleOptionNameBlur();
        }}
        onKeyDown={handleOptionNameKeyDown}
      />

      <fieldset
        className="space-y-3"
        aria-describedby={fieldsetDescribedBy}
      >
        <legend className="block text-sm font-medium text-gray-700">
          Values
        </legend>

        <p id="values-count-hint" className="text-xs text-gray-500">
          {valuesCount} of {MAX_VALUES} values
          {!canAddValue ? " — maximum reached" : ""}
        </p>

        <div className="space-y-3">
          {state.values.map((item, index) => (
            <ValueRow
              key={item.id}
              id={item.id}
              index={index}
              value={item.raw}
              error={state.errors.byValueId[item.id]}
              canRemove={state.values.length > MIN_VALUES}
              onChange={handleValueChange}
              onBlur={handleValueBlur}
              onRemove={handleValueRemove}
              onKeyDown={handleValueKeyDown}
              registerInputRef={registerInputRef}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddValue}
          disabled={!canAddValue}
          aria-disabled={!canAddValue}
          aria-describedby="values-count-hint"
          className="inline-flex items-center rounded-lg border border-dashed border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
        >
          + Add value
        </button>

        {state.errors.values ? (
          <p id="values-group-error" className="text-sm text-red-600" role="alert">
            {state.errors.values}
          </p>
        ) : null}
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-disabled={isSubmitDisabled}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          Save option
        </button>
      </div>
    </form>
  );
}
