import { useState } from 'react';
import cutout from '@/assets/jonas-cutout.webp';
import { person } from '@/data/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { applyTheme, currentTheme, storeTheme } from '@/lib/theme';

const NAV_LINKS = [
  { id: 'background', label: 'Background', wideOnly: true },
  { id: 'work', label: 'Work', wideOnly: true },
  { id: 'toolkit', label: 'Stack', wideOnly: true },
  { id: 'contact', label: 'Contact', wideOnly: false },
];

/** Sticky bar that takes over from the cover's nav once you scroll past it. */
export function TopBar() {
  const active = useActiveSection(NAV_LINKS.map((link) => link.id));
  const [theme, setTheme] = useState(currentTheme);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  };

  return (
    <div className="border-line bg-page/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-2.5 text-sm">
        <a href="#top" className="flex items-center gap-2.5 font-semibold no-underline">
          <span
            className="avatar"
            style={{ backgroundImage: `url(${cutout})` }}
            aria-hidden="true"
          />
          {person.name}
        </a>
        <nav aria-label="Sections" className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? 'true' : undefined}
              className={`text-muted hover:bg-tile hover:text-text aria-[current]:bg-tile aria-[current]:text-text rounded-full px-3 py-1.5 no-underline transition-colors ${link.wideOnly ? 'max-sm:hidden' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="text-muted hover:bg-tile hover:text-text cursor-pointer rounded-full px-3 py-1.5"
          >
            ◐
          </button>
        </nav>
      </div>
    </div>
  );
}
