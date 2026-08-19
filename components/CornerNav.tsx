"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Navigation is stripped to two magenta circles in the absolute corners — the
 * only chrome the style reference allows, and the only elements that break the
 * cream canvas. Left circle is the brand mark, right circle opens the index.
 */
export function CornerNav({ links }: { links: { slug: string; title: string }[] }) {
  const [open, setOpen] = useState(false);

  // Escape closes; body scroll locks while the overlay owns the viewport.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <Link
        href="/"
        aria-label="Jody's Playlists — home"
        className="fixed left-5 top-5 z-50 flex size-[50px] items-center justify-center rounded-full bg-lipstick-magenta text-warm-chalk transition-colors hover:bg-forest-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
      >
        {/* Lightning bolt brand mark. */}
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
          <path d="M13.5 2 4 14h6l-1.5 8L19 9h-6.5z" />
        </svg>
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close index" : "Open index"}
        className="fixed right-5 top-5 z-50 flex size-[50px] items-center justify-center rounded-full bg-lipstick-magenta text-warm-chalk transition-colors hover:bg-forest-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          {open ? (
            <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </g>
          ) : (
            <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </g>
          )}
        </svg>
      </button>

      {open ? (
        <nav
          aria-label="Playlist index"
          className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-warm-chalk px-6 py-28 sm:px-15"
        >
          <p className="label-micro mb-8 text-forest-ink">The index</p>
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.slug}>
                <Link
                  href={`/${link.slug}`}
                  onClick={() => setOpen(false)}
                  className="display-sm block text-forest-ink transition-colors hover:text-lipstick-magenta"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="label-micro mt-12 text-lipstick-magenta hover:text-forest-ink"
          >
            All playlists
          </Link>
        </nav>
      ) : null}
    </>
  );
}
