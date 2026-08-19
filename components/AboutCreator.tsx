"use client";

import { useEffect, useRef, useState } from "react";
import { CREATOR, hasCreatorSpotify } from "@/lib/site";

/**
 * "About the playlist creator" — a trigger link plus a modal blurb about Jody
 * and a link to her Spotify artist page.
 *
 * Appears on the home page and on every playlist page. The Spotify link is
 * omitted entirely until a real artist URL is configured, so a placeholder
 * never ships as a dead link.
 */
export function AboutCreator({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    // Capture the trigger now: by cleanup time the ref may point elsewhere,
    // and focus has to return to the element that actually opened the dialog.
    const trigger = triggerRef.current;

    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`label-micro text-left text-lipstick-magenta underline decoration-1 underline-offset-4 transition-colors hover:text-forest-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lipstick-magenta ${className}`}
      >
        About the playlist creator
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="creator-heading"
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-forest-ink/90 px-6 py-20"
        >
          {/* Backdrop click closes. The panel stops propagation below. */}
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative w-full max-w-[720px] bg-warm-chalk p-8 sm:p-12">
            <p className="label-micro mb-6 text-forest-ink">The playlist creator</p>

            <h2 id="creator-heading" className="display-sm mb-8 text-lipstick-magenta">
              {CREATOR.name}
            </h2>

            <p className="mb-6 max-w-[60ch] text-[14px] font-medium uppercase tracking-[0.1em] text-forest-ink/70">
              {CREATOR.role}
            </p>

            <p className="max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
              {CREATOR.blurb}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {hasCreatorSpotify() ? (
                <a
                  href={CREATOR.spotifyArtistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blush-cream px-[15px] py-[7px] text-[14px] font-medium text-forest-ink transition-colors hover:bg-lipstick-magenta hover:text-warm-chalk"
                >
                  {CREATOR.name} on Spotify ↗
                </a>
              ) : null}

              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="label-micro text-lipstick-magenta underline decoration-1 underline-offset-4 hover:text-forest-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lipstick-magenta"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
