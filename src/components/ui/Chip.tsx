interface ChipProps {
  children: React.ReactNode;
}

/** A quiet hairline-bordered label. Used for status and stack tags — no
 * color-coding, no shadow: gold stays reserved for interactive affordances. */
export function Chip({ children }: ChipProps) {
  return (
    <span className="border-line text-2xs text-muted inline-flex items-center rounded-sm border px-2 py-0.5">
      {children}
    </span>
  );
}
