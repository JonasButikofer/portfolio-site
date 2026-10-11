import { useEffect, useRef } from 'react';
import cutout from '@/assets/jonas-cutout.webp';
import { contact, person } from '@/data/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Full-height first screen. Copy and portrait live in separate grid cells
 * (see styles/cover.css), so they can't overlap at any width — including
 * during the scroll-out, where the copy lifts and fades while the portrait
 * sinks slightly.
 */
export function Cover() {
  const copyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [firstName, ...rest] = person.name.split(' ');

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      if (copyRef.current) {
        copyRef.current.style.transform = `translateY(${-y * 0.18}px)`;
        copyRef.current.style.opacity = String(1 - (y / window.innerHeight) * 1.3);
      }
      if (portraitRef.current) portraitRef.current.style.transform = `translateY(${y * 0.12}px)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <header className="cover" id="top">
      <nav className="cover-nav" aria-label="Primary">
        <a href="#background" className="is-wide-only">
          Background
        </a>
        <a href="#work" className="is-wide-only">
          Work
        </a>
        <a href="#toolkit" className="is-wide-only">
          Stack
        </a>
        <a href={contact.resumeHref} target="_blank" rel="noreferrer">
          Résumé ↗
        </a>
      </nav>

      <div className="cover-copy" ref={copyRef}>
        <span className="cover-status" style={{ '--i': 0 } as React.CSSProperties}>
          <i aria-hidden="true" />
          Open to roles · {person.graduation}
        </span>
        <h1 className="cover-name" style={{ '--i': 1 } as React.CSSProperties}>
          <span>{firstName}</span>
          <span>{rest.join(' ')}</span>
        </h1>
        <p className="cover-tagline" style={{ '--i': 2 } as React.CSSProperties}>
          {person.positioningLine}
        </p>
        <div className="cover-facts" style={{ '--i': 3 } as React.CSSProperties}>
          <div className="cover-fact">
            <b>Degree</b>
            <span className="cover-long">
              {person.degreeShort} · {person.schoolShort}
            </span>
            <span className="cover-short">
              {person.degreeShort.split(' ')[0]} · {person.schoolShort}
            </span>
          </div>
          <div className="cover-fact">
            <b>Major GPA</b>
            <span className="cover-fact-number">{person.gpa}</span>
          </div>
          <div className="cover-fact is-wide-only">
            <b>Now</b>
            <span>{person.currentRole}</span>
          </div>
        </div>
        <div className="cover-ctas" style={{ '--i': 4 } as React.CSSProperties}>
          <a className="cover-cta is-primary" href="#background">
            See my background ↓
          </a>
          <a className="cover-cta" href={`mailto:${contact.email}`}>
            Email me
          </a>
          <a className="cover-cta" href={contact.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>

      <div className="cover-portrait" ref={portraitRef}>
        <img src={cutout} alt={`Portrait of ${person.name}`} width={1000} height={1250} />
      </div>
    </header>
  );
}
