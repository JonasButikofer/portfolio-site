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
  const sectionLabel =
    'text-muted m-0 mt-6 mb-1.5 font-mono text-xs font-medium tracking-[0.06em] uppercase';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={p ? titleId : undefined}
      className="project-modal text-text fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-transparent sm:m-auto sm:h-fit sm:max-h-[calc(100dvh-40px)] sm:w-full sm:max-w-[760px] sm:p-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {p && (
        <div className="bg-tile border-line flex h-full max-h-[100dvh] flex-col border-0 sm:h-auto sm:max-h-[calc(100dvh-64px)] sm:rounded-3xl sm:border">
          <header className="flex shrink-0 items-start justify-between gap-4 px-7 pt-7">
            <div>
              <p className="eyebrow m-0">
                {p.context.type}
                {p.context.source && ` · ${p.context.source}`}
              </p>
              <h2 id={titleId} className="m-0 mt-3.5 text-[40px] leading-[1.02] tracking-[-0.04em]">
                {p.name}
              </h2>
              <p className="text-muted m-0 mt-1.5 text-lg">{p.tagline}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="border-line bg-tile-2 text-text hover:border-muted flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
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
            className="min-h-0 flex-1 overflow-y-auto px-7 pt-5 pb-7"
            tabIndex={0}
            role="region"
            aria-label={`${p.name} details`}
          >
            <dl className="m-0 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="border-line bg-tile-2 rounded-2xl border px-3.5 py-3">
                <dt className="text-muted font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
                  Status
                </dt>
                <dd className="m-0 font-medium">{p.status}</dd>
              </div>
              <div className="border-line bg-tile-2 rounded-2xl border px-3.5 py-3">
                <dt className="text-muted font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
                  {p.featuredMetric ? 'Impact' : 'Context'}
                </dt>
                <dd className="m-0 font-medium">
                  {p.featuredMetric ? (
                    <>
                      <span className="text-accent text-[28px] font-semibold tracking-[-0.03em]">
                        {p.featuredMetric.value}
                      </span>{' '}
                      <span className="text-muted text-[13px]">{p.featuredMetric.label}</span>
                    </>
                  ) : (
                    p.context.source || p.context.type
                  )}
                </dd>
              </div>
              <div className="border-line bg-tile-2 rounded-2xl border px-3.5 py-3">
                <dt className="text-muted font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
                  Stack
                </dt>
                <dd className="m-0 font-medium">{p.stack.length} tools</dd>
              </div>
            </dl>

            <h3 className={sectionLabel}>The problem</h3>
            <p className="m-0 max-w-(--measure) text-base">{p.problem}</p>

            <h3 className={sectionLabel}>What I built</h3>
            <p className="m-0 max-w-(--measure) text-base">{p.built}</p>

            {p.architecture && p.architecture.length > 0 && (
              <>
                <h3 className={sectionLabel}>How it flows</h3>
                <ol className="m-0 flex list-none flex-col gap-[18px] p-0">
                  {p.architecture.map((step, index) => (
                    <li
                      key={step}
                      className={`border-line bg-tile-2 relative rounded-xl border px-3.5 py-2.5 text-sm ${index > 0 ? "before:text-muted before:absolute before:-top-[18px] before:left-[18px] before:text-[13px] before:leading-[18px] before:content-['↓']" : ''}`}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {p.outcome && (
              <>
                <h3 className={sectionLabel}>Outcome</h3>
                <p className="m-0 max-w-(--measure) text-base">{p.outcome}</p>
              </>
            )}

            <h3 className={sectionLabel}>Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {p.stack.map((tech) => (
                <Chip key={tech}>{tech}</Chip>
              ))}
            </div>

            {p.links.length > 0 && (
              <>
                <h3 className={sectionLabel}>Links</h3>
                <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                  {p.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:decoration-accent text-base font-medium underline decoration-transparent underline-offset-4 transition-colors"
                      >
                        {link.label || LINK_LABEL_BY_KIND[link.kind]}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
