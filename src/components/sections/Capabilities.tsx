import { capabilityGroups, econometricsNote } from '@/data/site';

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-heading" className="mx-auto max-w-6xl px-6 py-20">
      <h2 id="capabilities-heading" className="font-display text-text text-2xl">
        What I work with
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {capabilityGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-display text-text text-base">{group.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item} className="font-body text-muted text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="border-line font-body text-muted mt-12 max-w-(--measure) border-t pt-6 text-base">
        Plus econometrics: {econometricsNote}
      </p>
    </section>
  );
}
