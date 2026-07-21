"use client";

import { useCallback, useId, useRef, useState, type FormEvent } from "react";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png"] as const;
const ACCEPTED_AVATAR_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024;

export type UserProfile = {
  fullName: string;
  email: string;
  password?: string;
  avatar: File | null;
};

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormFieldKey = keyof FormValues | "avatar";

type FormErrors = Partial<Record<FormFieldKey, string>>;

type ProfileUpdateFormProps = {
  initialProfile?: Partial<Pick<FormValues, "fullName" | "email">> & {
    avatarUrl?: string;
  };
  onSubmit?: (profile: UserProfile) => Promise<void> | void;
};

const defaultValues: FormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function validateFullName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Full name is required.";
  }
  if (trimmed.length < 3) {
    return "Full name must be at least 3 characters.";
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Email is required.";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Please enter a valid email address.";
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!PASSWORD_REGEX.test(value)) {
    return "Password must include at least one uppercase letter, one lowercase letter, and one number.";
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!password) {
    return undefined;
  }
  if (!confirmPassword) {
    return "Please confirm your password.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return undefined;
}

export function validateAvatar(file: File | null): string | undefined {
  if (!file) {
    return undefined;
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const hasValidExtension = ACCEPTED_AVATAR_EXTENSIONS.includes(extension);
  const hasValidMimeType =
    !file.type ||
    ACCEPTED_AVATAR_TYPES.includes(
      file.type as (typeof ACCEPTED_AVATAR_TYPES)[number],
    );

  if (!hasValidExtension || !hasValidMimeType) {
    return "Profile picture must be a .jpg, .jpeg, or .png file.";
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return "Profile picture must be 2MB or smaller.";
  }

  return undefined;
}

export function validateProfileForm(
  values: FormValues,
  avatar: File | null,
): FormErrors {
  const errors: FormErrors = {};

  const fullNameError = validateFullName(values.fullName);
  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validateConfirmPassword(
    values.password,
    values.confirmPassword,
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  const avatarError = validateAvatar(avatar);
  if (avatarError) {
    errors.avatar = avatarError;
  }

  return errors;
}

function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function ProfileUpdateForm({
  initialProfile,
  onSubmit,
}: ProfileUpdateFormProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>({
    ...defaultValues,
    fullName: initialProfile?.fullName ?? "",
    email: initialProfile?.email ?? "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialProfile?.avatarUrl ?? null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: FormFieldKey, nextValues: FormValues, nextAvatar: File | null) => {
      let error: string | undefined;

      switch (field) {
        case "fullName":
          error = validateFullName(nextValues.fullName);
          break;
        case "email":
          error = validateEmail(nextValues.email);
          break;
        case "password":
          error = validatePassword(nextValues.password);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(
            nextValues.password,
            nextValues.confirmPassword,
          );
          break;
        case "avatar":
          error = validateAvatar(nextAvatar);
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [],
  );

  const handleValueChange = (field: keyof FormValues, value: string) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setSubmitError(null);
    setSuccessMessage(null);
    validateField(field, nextValues, avatar);

    if (field === "password" || field === "confirmPassword") {
      validateField("password", nextValues, avatar);
      validateField("confirmPassword", nextValues, avatar);
    }
  };

  const handleBlur = (field: FormFieldKey) => {
    validateField(field, values, avatar);
  };

  const handleAvatarChange = (file: File | null) => {
    setSubmitError(null);
    setSuccessMessage(null);

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatar(file);

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(initialProfile?.avatarUrl ?? null);
    }

    validateField("avatar", values, file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateProfileForm(values, avatar);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    const payload: UserProfile = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      avatar,
    };

    if (values.password) {
      payload.password = values.password;
    }

    try {
      await onSubmit?.(payload);
      setSuccessMessage("Your profile has been updated successfully.");
      setValues((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setErrors((prev) => ({
        ...prev,
        password: undefined,
        confirmPassword: undefined,
      }));
    } catch {
      setSubmitError("Something went wrong while updating your profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setValues({
      ...defaultValues,
      fullName: initialProfile?.fullName ?? "",
      email: initialProfile?.email ?? "",
    });
    setAvatar(null);
    setAvatarPreview(initialProfile?.avatarUrl ?? null);
    setErrors({});
    setSubmitError(null);
    setSuccessMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
      aria-labelledby={`${formId}-title`}
    >
      <header className="mb-8">
        <h2
          id={`${formId}-title`}
          className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Update Profile
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Edit your personal information and save your changes.
        </p>
      </header>

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300"
        >
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        <AvatarField
          id={`${formId}-avatar`}
          inputRef={fileInputRef}
          previewUrl={avatarPreview}
          error={errors.avatar}
          disabled={isSubmitting}
          onChange={handleAvatarChange}
          onBlur={() => handleBlur("avatar")}
        />

        <FormField
          id={`${formId}-fullName`}
          label="Full Name"
          value={values.fullName}
          error={errors.fullName}
          disabled={isSubmitting}
          required
          onChange={(value) => handleValueChange("fullName", value)}
          onBlur={() => handleBlur("fullName")}
          placeholder="Jane Doe"
          autoComplete="name"
        />

        <FormField
          id={`${formId}-email`}
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          disabled={isSubmitting}
          required
          onChange={(value) => handleValueChange("email", value)}
          onBlur={() => handleBlur("email")}
          placeholder="jane@example.com"
          autoComplete="email"
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            id={`${formId}-password`}
            label="New Password"
            type="password"
            value={values.password}
            error={errors.password}
            disabled={isSubmitting}
            onChange={(value) => handleValueChange("password", value)}
            onBlur={() => handleBlur("password")}
            placeholder="Leave blank to keep current"
            autoComplete="new-password"
            hint="Optional. Min 8 characters with upper, lower, and a number."
          />

          <FormField
            id={`${formId}-confirmPassword`}
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            onChange={(value) => handleValueChange("confirmPassword", value)}
            onBlur={() => handleBlur("confirmPassword")}
            placeholder="Re-enter new password"
            autoComplete="new-password"
            hint={values.password ? "Required when changing password." : undefined}
          />
        </div>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {submitError}
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleReset}
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  hint?: string;
};

function FormField({
  id,
  label,
  value,
  error,
  disabled,
  required,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  autoComplete,
  hint,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const inputClassName =
    "mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 " +
    (error
      ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-800 dark:focus:ring-red-900"
      : "border-zinc-300 focus:border-zinc-400 focus:ring-zinc-200 dark:border-zinc-700 dark:focus:ring-zinc-800");

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-600 dark:text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClassName}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-zinc-400">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type AvatarFieldProps = {
  id: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  error?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  onBlur: () => void;
};

function AvatarField({
  id,
  inputRef,
  previewUrl,
  error,
  disabled,
  onChange,
  onBlur,
}: AvatarFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Profile Picture
      </label>

      <div className="mt-3 flex items-center gap-4">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
          aria-hidden="true"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              className="h-8 w-8 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
              />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ACCEPTED_AVATAR_EXTENSIONS.join(",")}
            disabled={disabled}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            onBlur={onBlur}
            className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200 dark:hover:file:bg-zinc-700"
            aria-invalid={Boolean(error)}
            aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
          />
          <p id={hintId} className="mt-1.5 text-xs text-zinc-400">
            Optional. JPG or PNG, up to 2MB.
          </p>
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
