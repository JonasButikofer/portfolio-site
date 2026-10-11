import { useEffect, useState } from 'react';

/** The id of the last section whose top has scrolled above `offset` px —
 * i.e. the section being read. Null while still above the first one. */
export function useActiveSection(ids: string[], offset = 140): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(',');

  useEffect(() => {
    const sectionIds = key.split(',');
    let frame = 0;
    const measure = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < offset) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [key, offset]);

  return active;
}
