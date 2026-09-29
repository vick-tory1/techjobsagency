"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export default function MobileMenu({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
      >
        <span className="grid gap-1.5">
          <span className="block h-0.5 w-5 rounded-full bg-gray-950"></span>
          <span className="block h-0.5 w-5 rounded-full bg-gray-950"></span>
          <span className="block h-0.5 w-5 rounded-full bg-gray-950"></span>
        </span>
      </button>
      {isOpen ? (
        <div
          className="absolute right-0 top-14 z-50 grid w-[min(88vw,22rem)] gap-1 rounded-lg border border-gray-200 bg-white p-3 text-sm font-semibold shadow-xl"
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("a,button")) setIsOpen(false);
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
