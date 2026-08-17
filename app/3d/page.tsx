'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import SceneContainer from '@/components/3d/SceneContainer';
import { WebGLErrorBoundary } from '@/components/3d/WebGLErrorBoundary';

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULTS = {
  color: '#8b5cf6',
  wireframe: false,
  distort: 0.4,
  speed: 1.5,
  autoRotate: true,
} as const;

const COLOR_PRESETS = [
  { label: 'Emerald', value: '#10b981', tw: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { label: 'Cyan',    value: '#06b6d4', tw: 'bg-cyan-500',    ring: 'ring-cyan-400'    },
  { label: 'Violet',  value: '#8b5cf6', tw: 'bg-violet-500',  ring: 'ring-violet-400'  },
  { label: 'Amber',   value: '#f59e0b', tw: 'bg-amber-400',   ring: 'ring-amber-400'   },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function ToggleRow({ id, checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      {/* The <label> provides a click target that activates the button; the
          button's accessible name comes from the explicit aria-label below. */}
      <label htmlFor={id} className="cursor-pointer select-none text-sm text-white/70">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50 ${
          checked ? 'bg-violet-500' : 'bg-white/20'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

interface SliderRowProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  displayValue: string;
}

function SliderRow({ id, label, min, max, step, value, onChange, displayValue }: SliderRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-white/50">
          {label}
        </label>
        <span className="min-w-[2.5rem] text-right text-xs font-semibold tabular-nums text-white/80">
          {displayValue}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-violet-500"
      />
    </div>
  );
}

// Color presets use the radiogroup + radio pattern so screen readers correctly
// announce mutual exclusivity and arrow-key navigation works between swatches.
interface ColorPresetsProps {
  color: string;
  onChange: (value: string) => void;
}

function ColorPresets({ color, onChange }: ColorPresetsProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const buttons =
        groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      if (!buttons?.length) return;

      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % buttons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + buttons.length) % buttons.length;
      }

      if (nextIndex !== null) {
        buttons[nextIndex].focus();
        onChange(COLOR_PRESETS[nextIndex].value);
      }
    },
    [onChange],
  );

  return (
    <div className="mb-5">
      <p id="color-group-label" className="mb-2.5 text-xs font-medium text-white/40">
        Color
      </p>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-labelledby="color-group-label"
        className="flex gap-2.5"
      >
        {COLOR_PRESETS.map((preset, index) => {
          const active = color === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={preset.label}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(preset.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`h-8 w-8 rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50 ${preset.ring} ${preset.tw} ${
                active
                  ? 'scale-110 ring-2 shadow-lg'
                  : 'opacity-55 hover:scale-105 hover:opacity-90'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ThreeDPage() {
  const [color, setColor]           = useState<string>(DEFAULTS.color);
  const [wireframe, setWireframe]   = useState<boolean>(DEFAULTS.wireframe);
  const [distort, setDistort]       = useState<number>(DEFAULTS.distort);
  const [speed, setSpeed]           = useState<number>(DEFAULTS.speed);
  const [autoRotate, setAutoRotate] = useState<boolean>(DEFAULTS.autoRotate);

  // Keep the browser tab title in sync for this client-only route.
  useEffect(() => {
    const previous = document.title;
    document.title = '3D AI Core | FlyRank AI';
    return () => {
      document.title = previous;
    };
  }, []);

  const handleReset = useCallback(() => {
    setColor(DEFAULTS.color);
    setWireframe(DEFAULTS.wireframe);
    setDistort(DEFAULTS.distort);
    setSpeed(DEFAULTS.speed);
    setAutoRotate(DEFAULTS.autoRotate);
  }, []);

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-[#050816]">

      {/* ── 3D Canvas (absolute fill) — wrapped in error boundary ─────────── */}
      <div className="absolute inset-0" aria-hidden="true">
        <WebGLErrorBoundary>
          <SceneContainer
            color={color}
            wireframe={wireframe}
            distort={distort}
            speed={speed}
            autoRotate={autoRotate}
          />
        </WebGLErrorBoundary>
      </div>

      {/* ── Subtle vignette edges ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,#050816_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050816]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050816]/80 to-transparent" />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-start justify-between px-4 pt-5 sm:px-6">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-400/80">
              FE-A42 · Real-time WebGL Experience
            </p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-white sm:text-xl">
              FlyRank 3D AI Core
            </h1>
            <p className="mt-1 text-xs text-white/40">
              Drag to orbit · scroll disabled · controls →
            </p>
          </div>

          <nav className="flex shrink-0 gap-2 pt-1" aria-label="Page navigation">
            <Link
              href="/chat"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50"
            >
              ← Chat
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main landmark wraps the interactive controls panel ────────────── */}
      {/*   pointer-events-none so the transparent overlay doesn't block the  */}
      {/*   canvas; individual interactive children restore pointer-events.   */}
      <main
        aria-label="Interactive 3D scene"
        className="pointer-events-none absolute inset-0 z-20"
      >
        <aside
          aria-label="Scene controls"
          className="
            pointer-events-auto
            absolute bottom-4 left-4 right-4 mx-auto w-auto max-w-sm
            rounded-2xl border border-white/10 bg-black/45 p-5 shadow-2xl
            backdrop-blur-2xl
            sm:bottom-auto sm:left-auto sm:right-5 sm:top-1/2 sm:w-72
            sm:-translate-y-1/2 sm:translate-x-0
          "
        >
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
          AI Core Controls
        </h2>

        {/* Color presets — radiogroup with roving tabindex */}
        <ColorPresets color={color} onChange={setColor} />

        {/* Sliders */}
        <div className="mb-5 space-y-4">
          <SliderRow
            id="distort-slider"
            label="Distortion"
            min={0}
            max={1}
            step={0.01}
            value={distort}
            onChange={setDistort}
            displayValue={distort.toFixed(2)}
          />
          <SliderRow
            id="speed-slider"
            label="Speed"
            min={0.1}
            max={5}
            step={0.1}
            value={speed}
            onChange={setSpeed}
            displayValue={`${speed.toFixed(1)}×`}
          />
        </div>

        {/* Toggles */}
        <div className="mb-5 space-y-3.5">
          <ToggleRow
            id="wireframe-toggle"
            label="Wireframe"
            checked={wireframe}
            onChange={setWireframe}
          />
          <ToggleRow
            id="autorotate-toggle"
            label="Auto-rotate"
            checked={autoRotate}
            onChange={setAutoRotate}
          />
        </div>

        {/* Divider */}
        <div className="mb-4 h-px bg-white/8" />

        {/* Reset */}
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/50 transition hover:border-white/20 hover:bg-white/10 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50 active:scale-[0.98]"
        >
          Reset to defaults
        </button>
      </aside>
    </main>
  </div>
  );
}
