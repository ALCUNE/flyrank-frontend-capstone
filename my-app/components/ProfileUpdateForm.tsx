"use client";

import { useState, type FormEvent } from "react";

export type UserProfile = {
  fullName: string;
  email: string;
  username: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
};

type ProfileUpdateFormProps = {
  initialProfile?: Partial<UserProfile>;
  onSubmit?: (profile: UserProfile) => Promise<void> | void;
  isLoading?: boolean;
};

const defaultProfile: UserProfile = {
  fullName: "",
  email: "",
  username: "",
  bio: "",
  phone: "",
  location: "",
  website: "",
};

type FormErrors = Partial<Record<keyof UserProfile, string>>;

function validateProfile(profile: UserProfile): FormErrors {
  const errors: FormErrors = {};

  if (!profile.fullName.trim()) {
    errors.fullName = "Ad soyad zorunludur.";
  }

  if (!profile.email.trim()) {
    errors.email = "E-posta zorunludur.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Geçerli bir e-posta adresi girin.";
  }

  if (!profile.username.trim()) {
    errors.username = "Kullanıcı adı zorunludur.";
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(profile.username)) {
    errors.username =
      "Kullanıcı adı 3–20 karakter olmalı; yalnızca harf, rakam ve alt çizgi içerebilir.";
  }

  if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
    errors.website = "Web sitesi http:// veya https:// ile başlamalıdır.";
  }

  if (profile.bio.length > 160) {
    errors.bio = "Biyografi en fazla 160 karakter olabilir.";
  }

  return errors;
}

export function ProfileUpdateForm({
  initialProfile,
  onSubmit,
  isLoading = false,
}: ProfileUpdateFormProps) {
  const [profile, setProfile] = useState<UserProfile>({
    ...defaultProfile,
    ...initialProfile,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateProfile(profile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit?.(profile);
    } catch {
      setSubmitError("Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
      aria-labelledby="profile-form-title"
    >
      <header className="mb-8">
        <h2
          id="profile-form-title"
          className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Profili Güncelle
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Kişisel bilgilerinizi düzenleyin ve kaydedin.
        </p>
      </header>

      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            id="fullName"
            label="Ad Soyad"
            value={profile.fullName}
            error={errors.fullName}
            disabled={disabled}
            onChange={(value) => handleChange("fullName", value)}
            placeholder="Örn. Ayşe Yılmaz"
            autoComplete="name"
          />

          <FormField
            id="username"
            label="Kullanıcı Adı"
            value={profile.username}
            error={errors.username}
            disabled={disabled}
            onChange={(value) => handleChange("username", value)}
            placeholder="ornek_kullanici"
            autoComplete="username"
          />
        </div>

        <FormField
          id="email"
          label="E-posta"
          type="email"
          value={profile.email}
          error={errors.email}
          disabled={disabled}
          onChange={(value) => handleChange("email", value)}
          placeholder="ornek@email.com"
          autoComplete="email"
        />

        <FormField
          id="bio"
          label="Biyografi"
          as="textarea"
          value={profile.bio}
          error={errors.bio}
          disabled={disabled}
          onChange={(value) => handleChange("bio", value)}
          placeholder="Kendinizden kısaca bahsedin..."
          maxLength={160}
          hint={`${profile.bio.length}/160 karakter`}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            id="phone"
            label="Telefon"
            type="tel"
            value={profile.phone}
            error={errors.phone}
            disabled={disabled}
            onChange={(value) => handleChange("phone", value)}
            placeholder="+90 555 123 45 67"
            autoComplete="tel"
          />

          <FormField
            id="location"
            label="Konum"
            value={profile.location}
            error={errors.location}
            disabled={disabled}
            onChange={(value) => handleChange("location", value)}
            placeholder="İstanbul, Türkiye"
            autoComplete="address-level2"
          />
        </div>

        <FormField
          id="website"
          label="Web Sitesi"
          type="url"
          value={profile.website}
          error={errors.website}
          disabled={disabled}
          onChange={(value) => handleChange("website", value)}
          placeholder="https://ornek.com"
          autoComplete="url"
        />
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
          disabled={disabled}
          onClick={() => {
            setProfile({ ...defaultProfile, ...initialProfile });
            setErrors({});
            setSubmitError(null);
          }}
          className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Sıfırla
        </button>

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
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
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  as?: "input" | "textarea";
  autoComplete?: string;
  maxLength?: number;
  hint?: string;
};

function FormField({
  id,
  label,
  value,
  error,
  disabled,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  autoComplete,
  maxLength,
  hint,
}: FormFieldProps) {
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
      </label>

      {as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          className={`${inputClassName} resize-none`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={inputClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-zinc-400">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
