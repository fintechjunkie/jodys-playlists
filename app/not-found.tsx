import Link from "next/link";
import { AnimatedTitle } from "@/components/AnimatedTitle";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-[1440px] flex-col justify-end px-6 pb-30 pt-40 sm:px-15">
      <p className="label-micro mb-8 text-forest-ink">404</p>
      <AnimatedTitle lines={["Nothing", "playing"]} className="display-lg" />
      <p className="mt-15 max-w-[60ch] text-[20px] leading-[1.2] text-forest-ink">
        That playlist doesn&apos;t exist, or it moved.
      </p>
      <Link
        href="/"
        className="label-micro mt-12 inline-block text-lipstick-magenta hover:text-forest-ink"
      >
        ← All playlists
      </Link>
    </div>
  );
}
