"use client";

interface ClientMarqueeProps {
  clients: string[];
}

/** Infinite client wordmark ticker. Pauses on hover, still under reduced motion. */
export default function ClientMarquee({ clients }: ClientMarqueeProps) {
  if (clients.length === 0) return null;
  const row = [...clients, ...clients];
  return (
    <div
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] motion-reduce:overflow-x-auto"
      aria-label="Clients worked with"
    >
      <div className="animate-marquee flex w-max items-center gap-12 pr-12 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((c, i) => (
          <span key={`${c}-${i}`} aria-hidden={i >= clients.length} className="flex items-center gap-12">
            <span className="whitespace-nowrap font-heading text-xl md:text-2xl font-medium tracking-tight text-zinc-400 transition-colors duration-300 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-white">
              {c}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-razzmatazz/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
