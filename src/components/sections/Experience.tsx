import { experience } from '@/data/site';

export function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="mx-auto max-w-6xl px-6 py-20">
      <h2 id="experience-heading" className="font-display text-text text-2xl">
        Experience
      </h2>

      <ol className="mt-10 flex flex-col">
        {experience.map((entry) => (
          <li
            key={entry.org}
            className="border-line flex flex-col gap-1 border-t py-6 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <div>
              <h3 className="font-display text-text text-base">{entry.title}</h3>
              <p className="font-body text-muted mt-1 text-base">
                {entry.org}, {entry.location}
              </p>
              {entry.note && (
                <p className="font-body text-muted mt-2 max-w-(--measure) text-base">
                  {entry.note}
                </p>
              )}
            </div>
            <p className="font-display text-2xs text-muted shrink-0">
              {entry.start}&ndash;{entry.end === 'present' ? 'present' : entry.end}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
