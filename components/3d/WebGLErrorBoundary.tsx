'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

// ── Error Boundary (must be a class component — hooks cannot catch render errors) ──

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'WebGL initialisation failed.';
    return { hasError: true, message };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[WebGLErrorBoundary]', error, info.componentStack);
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <WebGLFallback message={this.state.message} />;
    }
    return this.props.children;
  }
}

// ── Graceful fallback card ─────────────────────────────────────────────────────

function WebGLFallback({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-label="3D scene unavailable"
      className="flex h-full w-full items-center justify-center bg-[#050816] px-6"
    >
      <div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h2 className="text-base font-semibold text-white">3D Scene Unavailable</h2>

        <p className="mt-2 text-sm leading-6 text-white/55">
          {message ||
            'Your browser or device does not support WebGL, which is required for the 3D experience.'}
        </p>

        <p className="mt-4 text-xs text-white/30">
          Try enabling hardware acceleration in your browser settings, or switch to a
          WebGL-capable browser such as Chrome or Firefox.
        </p>
      </div>
    </div>
  );
}
