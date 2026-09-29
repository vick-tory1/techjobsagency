"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  label: string;
  className: string;
  autoPlay?: boolean;
  controls?: boolean;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const motionQuery = window.matchMedia(reducedMotionQuery);
  motionQuery.addEventListener("change", onStoreChange);
  return () => motionQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export default function LazyVideo({ src, poster, label, className, autoPlay = false, controls = false }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const reduceMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );

    const node = containerRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLoaded || !autoPlay || reduceMotion) return;
    videoRef.current?.play().catch(() => undefined);
  }, [autoPlay, isLoaded, reduceMotion]);

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop={autoPlay && !reduceMotion}
        playsInline
        controls={controls}
        preload="none"
        poster={poster}
        aria-label={label}
      >
        {isLoaded ? <source src={src} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
