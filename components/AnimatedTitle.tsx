import type { ElementType } from "react";

/**
 * A display title whose characters rise into place one after another.
 *
 * Pure CSS — the stagger is an inline `--i` per character feeding an
 * animation-delay in globals.css, so this stays a server component and the
 * animation runs before any JS arrives. `prefers-reduced-motion` kills it.
 *
 * The characters are aria-hidden and the real text goes on the wrapper's
 * aria-label, otherwise screen readers announce the title letter by letter.
 */
export function AnimatedTitle({
  text,
  as: Tag = "h1" as ElementType,
  className = "",
  /** Milliseconds of extra delay before the first character moves. */
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  // Split on spaces but keep them, so words wrap as units and never break
  // mid-word across lines.
  const words = text.split(" ");

  // Character index each word starts at, counting the spaces between them, so
  // the stagger runs evenly across the whole title rather than restarting per
  // word. Computed up front — mutating a counter during render is a bug.
  const wordOffsets = words.reduce<number[]>(
    (acc, word, i) => [...acc, acc[i] + [...word].length + 1],
    [0],
  );

  const rendered = words.map((word, wordIndex) => {
    const chars = [...word].map((char, charIndex) => ({
      char,
      i: wordOffsets[wordIndex] + charIndex,
    }));

    return (
      <span key={`${word}-${wordIndex}`} className="inline-block">
        {chars.map(({ char, i }) => (
          <span
            key={i}
            className="char"
            style={{ ["--i" as string]: i + delay / 28 }}
            aria-hidden
          >
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
      </span>
    );
  });

  return (
    <Tag className={className} aria-label={text}>
      {rendered}
    </Tag>
  );
}
