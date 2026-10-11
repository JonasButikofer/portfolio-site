import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/data/projects';

// Asymmetric masonry-ish spans on the 12-col grid (SPEC.md §4.4), keyed by
// position — project order is meaningful and fixed in src/data/projects.ts.
// Tailwind scans source for literal class names, so this can't be built
// from a template string — it has to be a lookup of whole class names.
const SPAN_CLASSES: Record<number, string> = {
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  12: 'md:col-span-12',
};
const COLUMN_SPANS = [7, 5, 6, 6, 12];
const DEFAULT_SPAN = 6;

interface ProjectGridProps {
  onOpen: (slug: string) => void;
}

export function ProjectGrid({ onOpen }: ProjectGridProps) {
  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="font-display text-text text-2xl">Selected work</h2>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        {projects.map((project, index) => {
          const span = COLUMN_SPANS[index] ?? DEFAULT_SPAN;
          const spanClass = SPAN_CLASSES[span] ?? SPAN_CLASSES[DEFAULT_SPAN];
          return (
            <div key={project.slug} className={spanClass}>
              <ProjectCard project={project} onOpen={onOpen} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
