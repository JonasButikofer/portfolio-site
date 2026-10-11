import { Eyebrow, SectionHeading } from '@/components/bento/Tile';
import { experience, person } from '@/data/site';

function Credential({
  label,
  value,
  detail,
  size,
  className = '',
}: {
  label: string;
  value: string;
  detail: string;
  size: 'big' | 'mid';
  className?: string;
}) {
  return (
    <div className={`tile lg:col-span-2 ${className}`}>
      <Eyebrow>{label}</Eyebrow>
      <p
        className={`mt-auto mb-0 pt-[18px] font-semibold ${size === 'big' ? 'text-[46px] leading-none tracking-[-0.045em]' : 'text-[22px] leading-[1.15] tracking-[-0.025em]'}`}
      >
        {value}
      </p>
      <p className="text-muted mt-1.5 mb-0 text-sm">{detail}</p>
    </div>
  );
}

/** Degree, GPA and graduation up front, then the work history. */
export function Background() {
  return (
    <>
      <SectionHeading
        id="background"
        title="Background"
        note={`${person.schoolShort} · class of ${person.graduation.split(' ').pop()}`}
      />
      <Credential
        label="Degree"
        value={person.degreeShort}
        detail={`${person.school} · Minor in ${person.minor}`}
        size="mid"
      />
      <Credential label="Major GPA" value={person.gpa} detail={person.honors} size="big" />
      <Credential
        label="Graduating"
        value={person.graduation}
        detail={`Based in ${person.location} · open to the ${person.openTo}`}
        size="big"
        // At two columns this would sit alone in its row — let it take the row.
        className="sm:col-span-2"
      />

      <div className="tile sm:col-span-2 lg:col-span-6" id="experience">
        <Eyebrow>Experience</Eyebrow>
        <ol className="m-0 mt-4 grid list-none grid-cols-1 gap-[18px] p-0 lg:grid-cols-3">
          {experience.map((entry, index) => (
            <li
              key={entry.org}
              className={`border-t-2 pt-3 ${index === 0 ? 'border-accent' : 'border-line'}`}
            >
              <p className="text-muted m-0 mb-1.5 font-mono text-xs">
                {entry.start} – {entry.end}
              </p>
              <h3 className="m-0 text-[15px] leading-[1.3]">{entry.title}</h3>
              <p className="text-muted m-0 mt-1 text-[13px]">
                {entry.org}
                {entry.location && ` · ${entry.location}`}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
