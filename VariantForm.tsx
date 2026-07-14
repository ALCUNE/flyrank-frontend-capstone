"use client";

import { useState, type FormEvent } from "react";

export type VariantOption = {
  name: string;
  values: string[];
};

type VariantFormProps = {
  onSubmit?: (option: VariantOption) => void;
  initialOption?: VariantOption;
};

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export default function VariantForm({
  onSubmit,
  initialOption,
}: VariantFormProps) {
  const [optionName, setOptionName] = useState(initialOption?.name ?? "");
  const [values, setValues] = useState<string[]>(
    initialOption?.values.length ? initialOption.values : [""],
  );
  const [errors, setErrors] = useState<{ name?: string; values?: string }>({});

  const updateValue = (index: number, nextValue: string) => {
    setValues((current) =>
      current.map((value, i) => (i === index ? nextValue : value)),
    );
  };

  const addValue = () => {
    setValues((current) => [...current, ""]);
  };

  const removeValue = (index: number) => {
    setValues((current) => current.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const nextErrors: { name?: string; values?: string } = {};
    const trimmedName = optionName.trim();
    const trimmedValues = values.map((value) => value.trim()).filter(Boolean);

    if (!trimmedName) {
      nextErrors.name = "Option name is required.";
    }

    if (trimmedValues.length === 0) {
      nextErrors.values = "Add at least one value.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const option: VariantOption = {
      name: optionName.trim(),
      values: values.map((value) => value.trim()).filter(Boolean),
    };

    onSubmit?.(option);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Create Variant Option
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Define an option such as Size or Color, then add one or more values.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="option-name"
          className="block text-sm font-medium text-gray-700"
        >
          Option name
        </label>
        <input
          id="option-name"
          type="text"
          value={optionName}
          onChange={(event) => setOptionName(event.target.value)}
          placeholder="e.g. Size, Color, Material"
          className={inputClassName}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "option-name-error" : undefined}
        />
        {errors.name ? (
          <p id="option-name-error" className="text-sm text-red-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-gray-700">
          Values
        </legend>

        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex items-start gap-2">
              <input
                type="text"
                value={value}
                onChange={(event) => updateValue(index, event.target.value)}
                placeholder={`Value ${index + 1}`}
                className={inputClassName}
                aria-label={`Value ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeValue(index)}
                disabled={values.length === 1}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Remove value ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addValue}
          className="inline-flex items-center rounded-lg border border-dashed border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
        >
          + Add value
        </button>

        {errors.values ? (
          <p className="text-sm text-red-600">{errors.values}</p>
        ) : null}
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          Save option
        </button>
      </div>
    </form>
  );
}
