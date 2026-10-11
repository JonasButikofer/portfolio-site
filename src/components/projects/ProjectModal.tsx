import { useEffect, useId, useRef, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import type { Project } from '@/data/projects';

interface ProjectModalProps {
  project: Project | undefined;
  onClose: () => void;
}

const LINK_LABEL_BY_KIND = { repo: 'Source', demo: 'Live demo', writeup: 'Write-up' } as const;

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isOpen = Boolean(project);

  // Keep showing the last project's content while the close transition
  // plays, instead of it disappearing the instant the URL updates. Adjusted
  // during render (React's documented pattern for this) rather than in an
  // effect, so it never causes an extra visible frame with stale content.
  const [displayedProject, setDisplayedProject] = useState<Project | undefined>(project);
  if (project && project !== displayedProject) {
    setDisplayedProject(project);
  }

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Handle Escape ourselves (preventing the native default) rather than
    // relying on the 'cancel' event it would otherwise fire, so closing
    // always routes through onClose and keeps history/URL state in sync
    // (SPEC.md §5.3 deep linking).
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const p = displayedProject;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={p ? titleId : undefined}
      className="project-modal fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent sm:inset-auto sm:m-auto sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-2xl sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {p && (
        <div className="bg-surface sm:border-line flex h-full max-h-[100dvh] flex-col border-0 sm:h-auto sm:max-h-[85vh] sm:border">
          <header className="border-line flex shrink-0 items-start justify-between gap-4 border-b p-6">
            <div>
              <h2 id={titleId} className="font-display text-text text-xl">
                {p.name}
              </h2>
              <p className="font-display text-2xs text-muted mt-1">
                {p.context.type}
                <span className="border-line mx-2 border-l" aria-hidden="true" />
                {p.context.source}
                <span className="border-line mx-2 border-l" aria-hidden="true" />
                {p.status}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-muted hover:text-text flex h-11 w-11 shrink-0 items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </button>
          </header>

          <div
            className="min-h-0 flex-1 overflow-y-auto p-6"
            tabIndex={0}
            role="region"
            aria-label={`${p.name} details`}
          >
            <section>
              <h3 className="font-display text-muted text-xs">The problem</h3>
              <p className="font-body text-text mt-2 max-w-(--measure) text-base">{p.problem}</p>
            </section>

            <section className="mt-8">
              <h3 className="font-display text-muted text-xs">What I built</h3>
              <p className="font-body text-text mt-2 max-w-(--measure) text-base">{p.built}</p>
            </section>

            {p.architecture && p.architecture.length > 0 && (
              <section className="mt-8">
                <h3 className="font-display text-muted text-xs">Architecture</h3>
                <ol className="mt-2 flex flex-col gap-2">
                  {p.architecture.map((step, index) => (
                    <li key={step} className="font-body text-text flex gap-3 text-base">
                      <span className="text-2xs text-muted font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {p.outcome && (
              <section className="mt-8">
                <h3 className="font-display text-muted text-xs">Outcome</h3>
                {p.featuredMetric && (
                  <p className="font-display text-gold mt-2 text-2xl">
                    {p.featuredMetric.value}
                    <span className="font-body text-2xs text-muted ml-2">
                      {p.featuredMetric.label}
                    </span>
                  </p>
                )}
                <p className="font-body text-text mt-2 max-w-(--measure) text-base">{p.outcome}</p>
              </section>
            )}

            <section className="mt-8">
              <h3 className="font-display text-muted text-xs">Stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.stack.map((tech) => (
                  <Chip key={tech}>{tech}</Chip>
                ))}
              </div>
            </section>

            {p.links.length > 0 && (
              <section className="mt-8">
                <h3 className="font-display text-muted text-xs">Links</h3>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  {p.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-display text-gold hover:decoration-gold text-base underline decoration-transparent underline-offset-4 transition-colors"
                      >
                        {link.label || LINK_LABEL_BY_KIND[link.kind]}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
