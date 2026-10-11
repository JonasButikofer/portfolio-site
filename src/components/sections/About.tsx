import photoAvif from '@/assets/jonas-photo.avif';
import photoWebp from '@/assets/jonas-photo.webp';
import photoJpg from '@/assets/jonas-photo.jpg';
import { person } from '@/data/site';

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-6 py-20">
      <h2 id="about-heading" className="font-display text-text text-2xl">
        About
      </h2>

      <div className="mt-8 flex flex-col gap-10 sm:flex-row sm:items-start">
        <div
          className="shrink-0 self-start rounded-sm p-2 sm:w-56"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--color-photo-backdrop) 35%, transparent), transparent 70%)',
          }}
        >
          <picture>
            <source srcSet={photoAvif} type="image/avif" />
            <source srcSet={photoWebp} type="image/webp" />
            <img
              src={photoJpg}
              alt="Jonas Butikofer"
              width={1000}
              height={1250}
              loading="lazy"
              className="border-photo-shirt aspect-[4/5] w-full border object-cover"
            />
          </picture>
        </div>

        <div className="font-body text-text max-w-(--measure) text-base">
          <p>
            I'm a final-year {person.degree} student at {person.school}, with a minor in{' '}
            {person.minor}, graduating {person.graduation}. I grew up in Northern Virginia and am
            currently based in {person.location}, open to the {person.openTo}.
          </p>
          <p className="mt-4">
            {person.gpa}. {person.certification}.
          </p>
        </div>
      </div>
    </section>
  );
}
