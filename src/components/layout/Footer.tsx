import { person } from '@/data/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-muted mx-auto max-w-[1200px] px-6 pt-6 pb-10 font-mono text-xs">
      &copy; {year} {person.name} · {person.location}
    </footer>
  );
}
