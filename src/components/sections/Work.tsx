import { Eyebrow, SectionHeading } from '@/components/bento/Tile';
import { Chip } from '@/components/ui/Chip';
import { projects, type FeaturedMetric, type Project } from '@/data/projects';

interface WorkProps {
  onOpen: (slug: string) => void;
}

// Beacon's medallion layers take these in order; any extra steps reuse the last.
const LAYER_COLORS = [
  'var(--color-bronze)',
  'var(--color-silver)',
  'var(--color-gold)',
  'var(--color-accent)',
];

/** Before/after bars, each drawn to scale against the largest value. */
function ComparisonBars({ rows }: { rows: NonNullable<FeaturedMetric['comparison']> }) {
  const max = Math.max(...rows.map((row) => row.value));
  return (
    <div className="metric-bars">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`metric-bar ${index === rows.length - 1 ? 'is-after' : ''}`}
        >
          <span>{row.label}</span>
          <i style={{ width: `${(row.value / max) * 100}%` }} data-note={row.note} />
          <b>{row.display}</b>
        </div>
      ))}
    </div>
  );
}

function MetricTile({
  project,
  metric,
  className,
  onOpen,
}: {
  project: Project;
  metric: FeaturedMetric;
  className: string;
  onOpen: WorkProps['onOpen'];
}) {
  return (
    <button type="button" className={`tile ${className}`} onClick={() => onOpen(project.slug)}>
      <Eyebrow opens>{project.name}</Eyebrow>
      <p className="m-0 mt-4 text-[60px] leading-none font-semibold tracking-[-0.05em] tabular-nums">
        {metric.value}
      </p>
      <p className="text-muted m-0 mt-1.5 max-w-[34ch]">{metric.label}</p>
      {metric.comparison && <ComparisonBars rows={metric.comparison} />}
      {metric.units && (
        <div className="unit-chart" role="img" aria-label={`${metric.value} ${metric.label}`}>
          {Array.from({ length: metric.units }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      )}
    </button>
  );
}

function ProjectTile({
  project,
  className,
  onOpen,
}: {
  project: Project;
  className: string;
  onOpen: WorkProps['onOpen'];
}) {
  return (
    <button type="button" className={`tile ${className}`} onClick={() => onOpen(project.slug)}>
      <Eyebrow opens>{project.context.type}</Eyebrow>
      <h3 className="m-0 mt-3.5 mb-1.5 text-xl leading-[1.15] tracking-[-0.02em]">
        {project.name}
      </h3>
      <p className="text-muted m-0 mb-3.5 text-sm">{project.tagline}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.stack.slice(0, 4).map((tech) => (
          <Chip key={tech}>{tech}</Chip>
        ))}
      </div>
    </button>
  );
}

function FeatureTile({ project, onOpen }: { project: Project; onOpen: WorkProps['onOpen'] }) {
  // Architecture steps written as "Layer — what happens" become the medallion strip.
  const layers = (project.architecture ?? [])
    .map((step) => step.split(' — '))
    .filter((parts) => parts.length === 2)
    .slice(0, 4);

  return (
    <button
      type="button"
      className="tile sm:col-span-2 lg:col-span-4 lg:row-span-2"
      onClick={() => onOpen(project.slug)}
    >
      <Eyebrow opens>Featured · {project.status}</Eyebrow>
      <h3 className="m-0 mt-3.5 mb-1.5 text-[34px] leading-[1.05] tracking-[-0.035em]">
        {project.name}
      </h3>
      <p className="text-muted m-0 max-w-[46ch]">{project.tagline}</p>
      {project.outcome && (
        <p className="border-accent text-muted m-0 mt-[18px] max-w-[52ch] border-l-2 pl-3 text-sm">
          <b className="text-text mb-0.5 block font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
            Where it stands
          </b>
          {project.outcome}
        </p>
      )}
      {layers.length > 0 && (
        <div className="mt-auto grid grid-cols-2 gap-2 pt-[22px] sm:grid-cols-4">
          {layers.map(([name, what], index) => (
            <div
              key={name}
              className="layer"
              style={
                {
                  '--layer-color': LAYER_COLORS[Math.min(index, LAYER_COLORS.length - 1)],
                  '--layer-delay': `${index * 0.35}s`,
                } as React.CSSProperties
              }
            >
              <b className="mb-1 block font-mono text-[11px] font-medium tracking-[0.06em] uppercase">
                {name}
              </b>
              <span className="line-clamp-2">{what}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

/**
 * The featured project leads as the large tile; every other project follows
 * in projects-content.json order — as an impact tile when it has a
 * featuredMetric, a plain project tile otherwise.
 */
export function Work({ onOpen }: WorkProps) {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <>
      <SectionHeading id="work" title="Selected work" note="click any tile for the full story" />
      <FeatureTile project={featured} onOpen={onOpen} />
      {rest.map((project, index) => {
        // At two columns an odd last tile would sit alone — let it take the row.
        const lonely = index === rest.length - 1 && rest.length % 2 === 1;
        const className = `lg:col-span-2 ${lonely ? 'sm:col-span-2' : ''}`;
        return project.featuredMetric ? (
          <MetricTile
            key={project.slug}
            project={project}
            metric={project.featuredMetric}
            className={className}
            onOpen={onOpen}
          />
        ) : (
          <ProjectTile key={project.slug} project={project} className={className} onOpen={onOpen} />
        );
      })}
    </>
  );
}
