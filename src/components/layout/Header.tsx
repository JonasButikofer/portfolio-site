import { contact } from '@/data/site';

const NAV_LINKS = [
  { href: '#work', label: 'work' },
  { href: '#about', label: 'about' },
];

export function Header() {
  return (
    <header className="border-line bg-ink sticky top-0 z-40 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-text text-base font-semibold">
          jonas butikofer
        </a>
        <nav aria-label="Primary" className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-muted hover:text-text text-xs transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href={contact.resumeHref}
            target="_blank"
            rel="noreferrer"
            className="font-display text-muted hover:text-text text-xs transition-colors"
          >
            cv
          </a>
        </nav>
      </div>
    </header>
  );
}
