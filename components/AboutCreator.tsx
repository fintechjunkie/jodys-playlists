"use client";

import { useEffect, useRef, useState } from "react";
import { CREATOR } from "@/lib/site";
import { AnimatedTitle } from "./AnimatedTitle";

/**
 * "About the playlist creator" — a trigger link plus a modal blurb about Jody
 * and a link to her Spotify artist page. Appears on the home page and on every
 * playlist page.
 *
 * The reveal is built as a screenprint pass rather than a fade: the panel wipes
 * in behind a hard vertical edge, the magenta plate slides into a deliberate
 * misregistration offset behind it, and the name sets itself letter by letter.
 * The offset plate is a flat rectangle, not a shadow — no blur is involved,
 * which keeps it inside the style reference's ban on depth effects.
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
          className="backdrop-in fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-forest-ink/90 px-6 py-20"
        >
          {/* Backdrop click closes. */}
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative w-full max-w-[720px]">
            {/* Offset magenta plate — the misregistered second pass. */}
            <div
              aria-hidden
              className="registration-layer absolute inset-0 bg-lipstick-magenta"
            />

            <div className="panel-wipe relative border-[3px] border-forest-ink bg-warm-chalk p-8 sm:p-12">
              <p className="label-micro mb-6 text-forest-ink">The playlist creator</p>

              <AnimatedTitle
                lines={[CREATOR.name]}
                as="h2"
                className="display-sm mb-8"
                delay={200}
              />
              {/* AnimatedTitle sets its own aria-label; this id is what the
                  dialog points at for its accessible name. */}
              <span id="creator-heading" className="sr-only">
                {CREATOR.name}
              </span>

              <p className="mb-6 max-w-[60ch] text-[13px] font-medium uppercase tracking-[0.1em] text-forest-ink/70">
                {CREATOR.role}
              </p>

              <div className="flex max-w-[60ch] flex-col gap-4">
                {CREATOR.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[20px] leading-[1.2] text-forest-ink">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href={CREATOR.spotifyArtistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-forest-ink bg-forest-ink px-5 py-2.5 text-[14px] font-semibold text-warm-chalk transition-colors hover:border-lipstick-magenta hover:bg-lipstick-magenta"
                >
                  Listen on Spotify ↗
                </a>

                <a
                  href={CREATOR.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-forest-ink px-5 py-2.5 text-[14px] font-semibold text-forest-ink transition-colors hover:border-lipstick-magenta hover:text-lipstick-magenta"
                >
                  {CREATOR.instagramHandle} ↗
                </a>

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
        </div>
      ) : null}
    </>
  );
}
