import { Chip } from '@/components/ui/Chip';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  onOpen: (slug: string) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project.slug)}
      className="group border-line bg-surface hover:border-muted flex h-full w-full flex-col items-start gap-4 border p-6 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-surface)_85%,white)] sm:p-8"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <h3 className="font-display text-text text-lg">{project.name}</h3>
        <Chip>{project.status}</Chip>
      </div>

      <p className="font-body text-muted text-base">{project.tagline}</p>

      {project.featuredMetric && (
        <p className="font-display text-gold text-2xl">
          {project.featuredMetric.value}
          <span className="font-body text-2xs text-muted ml-2">{project.featuredMetric.label}</span>
        </p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {project.stack.slice(0, 3).map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>
    </button>
  );
}
