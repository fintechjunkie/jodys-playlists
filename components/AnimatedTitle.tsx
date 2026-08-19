import type { ElementType } from "react";

/**
 * Default color cycle for stacked display lines, straight from the style
 * reference: full-intensity magenta, then mid pink, then the faded wash.
 *
 * This matters structurally, not just decoratively — at line-height 0.70 the
 * lines physically overlap, so consecutive lines MUST differ in color or the
 * block reads as illegible mush.
 */
const LINE_COLORS = ["text-lipstick-magenta", "text-bubblegum", "text-cotton-pink"];

/**
 * A display title whose characters rise into place one after another.
 *
 * Pure CSS — the stagger is an inline `--i` per character feeding an
 * animation-delay in globals.css, so this stays a server component and the
 * animation runs before any JS arrives. `prefers-reduced-motion` kills it.
 *
 * Characters are individually positioned, which means they must be grouped into
 * word-level inline-blocks: without that grouping the browser treats every
 * character as its own break opportunity and happily splits "DRIVE" into
 * "DRI / VE" at narrow widths. Words are atomic; only the spaces between them
 * are breakable.
 *
 * The characters are aria-hidden and the real text goes on the wrapper's
 * aria-label, otherwise screen readers announce the title letter by letter.
 */
export function AnimatedTitle({
  lines,
  as: Tag = "h1" as ElementType,
  className = "",
  colors = LINE_COLORS,
  /** Milliseconds of extra delay before the first character moves. */
  delay = 0,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  colors?: string[];
  delay?: number;
}) {
  // Character index each line starts at, so the stagger runs continuously
  // across the whole title instead of restarting per line.
  const lineOffsets = lines.reduce<number[]>(
    (acc, line, i) => [...acc, acc[i] + [...line].length],
    [0],
  );

  return (
    <Tag className={className} aria-label={lines.join(" ")}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");

        // Character offset of each word within its line, counting the spaces.
        const wordOffsets = words.reduce<number[]>(
          (acc, word, i) => [...acc, acc[i] + [...word].length + 1],
          [0],
        );

        return (
          <span
            key={`${line}-${lineIndex}`}
            // Each line is its own block so the color applies per line and the
            // overlapping leading stays intentional.
            className={`block ${colors[lineIndex % colors.length]}`}
          >
            {words.map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`}>
                {/* Atomic word: cannot break mid-word. */}
                <span className="inline-block">
                  {[...word].map((char, charIndex) => {
                    const i = lineOffsets[lineIndex] + wordOffsets[wordIndex] + charIndex;
                    return (
                      <span
                        key={i}
                        className="char"
                        style={{ ["--i" as string]: i + delay / 28 }}
                        aria-hidden
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
                {/* Breakable space between words. */}
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
