import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-3xl tracking-tight">Nothing playing here</h1>
      <p className="mt-4 text-muted">That playlist doesn&apos;t exist, or it moved.</p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm underline underline-offset-4 text-muted hover:text-text"
      >
        Back to all playlists
      </Link>
    </div>
  );
}
