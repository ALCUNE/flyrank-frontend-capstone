'use client';

import dynamic from 'next/dynamic';
import type { InteractiveShapeProps } from './InteractiveShape';

// ── Loading skeleton shown while the WebGL bundle hydrates ───────────────────

function LoadingSkeleton() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[#050816]"
      aria-label="Loading 3D scene"
      role="status"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring */}
        <span className="absolute h-40 w-40 animate-ping rounded-full bg-violet-500/10" />
        {/* Mid ring */}
        <span className="absolute h-28 w-28 animate-pulse rounded-full bg-violet-500/15 blur-md" />
        {/* Core glow */}
        <span className="relative h-16 w-16 animate-pulse rounded-full bg-violet-500/40 blur-xl" />
        {/* Label */}
        <span className="absolute mt-40 text-xs font-medium tracking-widest text-violet-400/60 uppercase">
          Loading WebGL…
        </span>
      </div>
    </div>
  );
}

// ── Dynamically imported scene — SSR disabled for WebGL compatibility ─────────

const InteractiveShape = dynamic<InteractiveShapeProps>(
  () => import('./InteractiveShape'),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  },
);

export default function SceneContainer(props: InteractiveShapeProps) {
  return <InteractiveShape {...props} />;
}
