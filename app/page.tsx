"use client";

import Link from "next/link";
import { ProfileUpdateForm, type UserProfile } from "@/components/ProfileUpdateForm";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile Settings" },
  { href: "/playground", label: "Playground" },
  { href: "/api/health", label: "Health Check", external: true },
];

async function handleProfileSubmit(profile: UserProfile) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Profile updated:", {
    fullName: profile.fullName,
    email: profile.email,
    hasPassword: Boolean(profile.password),
    avatar: profile.avatar?.name ?? null,
  });
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
              FlyRank AI Internship Capstone
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              FlyRank AI — Frontend Capstone Project
            </h1>
            <p className="max-w-3xl text-base text-slate-600 dark:text-slate-400">
              by <span className="font-medium text-slate-900 dark:text-slate-100">Deniz Erdoğan</span>
            </p>
          </div>

          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section
          aria-labelledby="architecture-heading"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
        >
          <h2
            id="architecture-heading"
            className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Capstone Architecture Overview
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            This project demonstrates a production-oriented Next.js App Router setup with
            modular React components, TypeScript-first validation, and Tailwind CSS utility
            styling. The profile workflow is built as a standalone client component with
            real-time field validation, accessible error messaging, and async submission states.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Responsive Layout
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Mobile-first Tailwind CSS patterns with adaptive grids, spacing, and readable
                typography across screen sizes.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Type-Safe Validation
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Pure React state handlers enforce regex email rules, password strength checks,
                confirm-password matching, and avatar file constraints.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                WCAG Accessibility
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Inputs use associated labels, `aria-invalid`, `aria-describedby`, and
                `role="alert"` error regions for screen reader support.
              </p>
            </article>
          </div>
        </section>

        <section aria-labelledby="profile-form-heading" className="pb-8">
          <div className="mb-6">
            <h2
              id="profile-form-heading"
              className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
            >
              Profile Update Demo
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
              Update the sample profile below to explore validation, accessibility feedback,
              avatar upload limits, and submission loading states.
            </p>
          </div>

          <ProfileUpdateForm
            initialProfile={{
              fullName: "Deniz Erdoğan",
              email: "denizerdogan.web@gmail.com",
            }}
            onSubmit={handleProfileSubmit}
          />
        </section>
      </main>
    </div>
  );
}
