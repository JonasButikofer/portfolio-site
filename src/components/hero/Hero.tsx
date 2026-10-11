import { LineageGraph } from '@/components/hero/LineageGraph';
import { person } from '@/data/site';

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
      <h1 className="font-display text-text text-3xl font-extrabold tracking-tight sm:text-4xl">
        {person.name}
      </h1>
      <p className="font-display text-md text-muted mt-4 max-w-(--measure)">
        {person.positioningLine}
      </p>

      <div className="mt-16">
        <LineageGraph />
      </div>
    </section>
  );
}
