/**
 * The "faded echo" band from the style reference, set in motion: the playlist
 * title repeated at display scale in blush cream, drifting sideways forever.
 *
 * It sits behind the real title and is decorative only — aria-hidden, and it
 * stops entirely under prefers-reduced-motion.
 *
 * The track is duplicated and translated by exactly -50%, so the loop is
 * seamless with no JS measuring anything.
 */
export function TitleMarquee({
  text,
  reverse = false,
  className = "",
}: {
  text: string;
  reverse?: boolean;
  className?: string;
}) {
  // Enough repeats that the track always overflows even a very wide viewport.
  const run = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="display-lg shrink-0 pr-10">
      {text}
    </span>
  ));

  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`}>
        <div className="flex shrink-0">{run}</div>
        {/* Duplicate track — the -50% translate lands exactly here. */}
        <div className="flex shrink-0">{run}</div>
      </div>
    </div>
  );
}
