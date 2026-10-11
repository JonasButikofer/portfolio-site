import { Eyebrow, SectionHeading } from '@/components/bento/Tile';
import { capabilityGroups, contact, econometricsNote, person } from '@/data/site';

const CONTACT_LINKS = [
  { label: 'Email', href: `mailto:${contact.email}`, external: false },
  { label: 'LinkedIn', href: contact.linkedinUrl, external: true },
  { label: 'GitHub', href: contact.githubUrl, external: true },
  { label: 'Résumé', href: contact.resumeHref, external: true },
];

export function Toolkit() {
  return (
    <>
      <SectionHeading id="toolkit" title="Toolkit" />

      <div className="tile sm:col-span-2 lg:col-span-4">
        <Eyebrow>What I work with</Eyebrow>
        <div className="mt-4 grid grid-cols-1 gap-x-[18px] gap-y-4 sm:grid-cols-2">
          {capabilityGroups.map((group) => (
            <div key={group.title}>
              <h3 className="m-0 mb-1.5 text-[13px]">{group.title}</h3>
              <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-line bg-tile-2 text-muted rounded-md border px-[7px] py-0.5 font-mono text-[11.5px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-line text-muted m-0 mt-4 border-t pt-3 text-[13px]">
          Plus econometrics: {econometricsNote}.
        </p>
      </div>

      <div className="tile contact-tile justify-between sm:col-span-2 lg:col-span-2" id="contact">
        <Eyebrow>Get in touch</Eyebrow>
        <div>
          <h3 className="m-0 mt-3.5 mb-2 text-[28px] leading-[1.1] tracking-[-0.03em]">
            Hiring for data, analytics, or integration engineering?
          </h3>
          <p className="m-0 mb-[18px] text-sm opacity-85">
            Open to roles starting {person.graduation} — {person.openTo}.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-3.5 p-0 text-sm font-medium">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="border-b border-current no-underline"
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
