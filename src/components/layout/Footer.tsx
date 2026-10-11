import { contact, person } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-line border-t">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-text text-2xl">Get in touch</h2>
        <p className="font-body text-muted mt-3 max-w-(--measure)">
          Open to Data Engineer, Analytics Engineer, and Data Integration Engineer roles starting{' '}
          {person.graduation}, in the {person.openTo}.
        </p>

        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a
              href={`mailto:${contact.email}`}
              className="font-display text-gold hover:decoration-gold text-base underline decoration-transparent underline-offset-4 transition-colors"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="font-display text-gold hover:decoration-gold text-base underline decoration-transparent underline-offset-4 transition-colors"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="font-display text-gold hover:decoration-gold text-base underline decoration-transparent underline-offset-4 transition-colors"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={contact.resumeHref}
              target="_blank"
              rel="noreferrer"
              className="font-display text-gold hover:decoration-gold text-base underline decoration-transparent underline-offset-4 transition-colors"
            >
              Resume
            </a>
          </li>
        </ul>

        <p className="font-display text-2xs text-muted mt-16">
          &copy; {year} {person.name}
        </p>
      </div>
    </footer>
  );
}
