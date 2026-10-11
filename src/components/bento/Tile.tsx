interface SectionHeadingProps {
  id: string;
  title: string;
  note?: string;
}

/** Full-width row that labels a group of tiles. */
export function SectionHeading({ id, title, note }: SectionHeadingProps) {
  return (
    <div
      id={id}
      className="col-span-full flex scroll-mt-16 items-baseline justify-between gap-4 px-1 pt-7"
    >
      <h2 className="m-0 text-[22px] tracking-[-0.02em]">{title}</h2>
      {note && <span className="text-muted font-mono text-xs">{note}</span>}
    </div>
  );
}

/** The mono, uppercase label at the top of every tile. Pass `opens` on
 * clickable tiles to show the ↗ affordance. */
export function Eyebrow({ children, opens }: { children: React.ReactNode; opens?: boolean }) {
  return (
    <div className="eyebrow">
      <span>{children}</span>
      {opens && (
        <span className="open-icon" aria-hidden="true">
          ↗
        </span>
      )}
    </div>
  );
}
