"use client";

import Link from "next/link";
import { Box, Sparkles } from "lucide-react";
import { ProfileUpdateForm, type UserProfile } from "@/components/ProfileUpdateForm";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile Settings" },
  { href: "/playground", label: "Playground" },
  { href: "/chat", label: "Chat" },
  { href: "/3d", label: "3D Lab" },
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

        {/* ── 3D Lab feature card ─────────────────────────────────────────── */}
        <Link
          href="/3d"
          className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-slate-900 via-[#0d0a1f] to-slate-900 p-6 shadow-lg transition hover:border-violet-400/60 hover:shadow-violet-500/10 hover:shadow-2xl sm:p-8"
        >
          {/* Ambient glow blob */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl transition duration-500 group-hover:bg-violet-500/30"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 left-8 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Icon + text */}
            <div className="flex items-start gap-4">
              <span className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 p-3 ring-1 ring-violet-500/30 transition duration-300 group-hover:bg-violet-500/25">
                <Box className="h-7 w-7 text-violet-400" aria-hidden="true" />
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Interactive 3D AI Core
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-300 ring-1 ring-violet-500/30">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    WebGL
                  </span>
                </div>
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-400">
                  Real-time Three.js scene with floating gem geometry, MeshDistortMaterial,
                  contact shadows, and a glassmorphism control panel — drag to orbit, tweak
                  distortion and speed live.
                </p>
              </div>
            </div>

            {/* CTA */}
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-5 py-2.5 text-sm font-medium text-violet-300 transition duration-200 group-hover:border-violet-400 group-hover:bg-violet-500/20 group-hover:text-violet-200 sm:self-center">
              Explore 3D Lab
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* ── Architecture overview ──────────────────────────────────────── */}
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
