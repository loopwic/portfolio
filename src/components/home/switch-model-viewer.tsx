"use client";

import { useEffect, useRef, useState } from "react";

export const SwitchModelViewer = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "45% 0px" }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!(canvas && shouldLoad)) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const mount = async () => {
      try {
        const { mountCherryMxSwitch } =
          await import("@/components/home/cherry-mx-runtime");

        if (cancelled) {
          return;
        }

        const mountedCleanup = await mountCherryMxSwitch(canvas, {
          onProgress: (value) => {
            if (!cancelled) {
              setProgress(value);
            }
          },
        });

        if (cancelled) {
          mountedCleanup();
          return;
        }

        cleanup = mountedCleanup;
        setReady(true);
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    };

    void mount();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [shouldLoad]);

  return (
    <div
      className="switch-model-viewer"
      data-error={error || undefined}
      data-ready={ready || undefined}
      ref={hostRef}
    >
      <canvas
        aria-label="基于 BlackCube Cherry MX Switches 制作的无灯网页装配模型，正面灯位已填平，下方矩形槽向下贯通，并恢复轴体两根导通针脚"
        className="switch-model-viewer__canvas"
        ref={canvasRef}
      >
        Modified Cherry MX switch 3D model
      </canvas>

      <div
        aria-live="polite"
        className="switch-model-status font-mono text-3xs uppercase tracking-[0.18em] text-foreground/38"
      >
        {error ? "Model unavailable" : `${progress}%`}
      </div>
    </div>
  );
};
