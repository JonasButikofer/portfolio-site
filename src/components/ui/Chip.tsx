interface ChipProps {
  children: React.ReactNode;
}

/** A quiet hairline-bordered mono label for stack tags. No color-coding:
 * the accent stays reserved for interactive affordances. */
export function Chip({ children }: ChipProps) {
  return (
    <span className="border-line bg-tile-2 text-muted inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11.5px]">
      {children}
    </span>
  );
}
