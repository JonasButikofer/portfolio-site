import type { Project, ProjectLink, ProjectStatus } from '@/data/projects';
import {
  AddButton,
  bind,
  bindList,
  Field,
  RemoveButton,
  SelectField,
  TextAreaField,
} from './fields';

const STATUS_OPTIONS: ProjectStatus[] = ['In progress', 'Complete', 'Ongoing', 'Approaching MVP'];
const LINK_KIND_OPTIONS: ProjectLink['kind'][] = ['repo', 'demo', 'writeup'];

interface ProjectsSectionProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  function updateProject(index: number, next: Project) {
    onChange(projects.map((p, i) => (i === index ? next : p)));
  }

  function addProject() {
    onChange([
      ...projects,
      {
        slug: 'new-project',
        name: 'New project',
        tagline: '',
        context: { type: '', source: '' },
        status: 'In progress',
        problem: '',
        built: '',
        stack: [],
        links: [],
      },
    ]);
  }

  function removeProject(index: number) {
    onChange(projects.filter((_, i) => i !== index));
  }

  function moveProject(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-gold text-lg">Projects</h2>
        <p className="text-muted text-xs">
          Order matters — the grid reads top to bottom in this order. Changing a slug breaks any
          existing ?project= links to it.
        </p>
      </div>

      {projects.map((project, i) => (
        <ProjectCard
          key={i}
          project={project}
          onChange={(next) => updateProject(i, next)}
          onRemove={() => removeProject(i)}
          onMoveUp={() => moveProject(i, -1)}
          onMoveDown={() => moveProject(i, 1)}
          isFirst={i === 0}
          isLast={i === projects.length - 1}
        />
      ))}

      <AddButton onClick={addProject} label="Add project" />
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  onChange: (next: Project) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function ProjectCard({
  project,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ProjectCardProps) {
  const metric = project.featuredMetric ?? { value: '', label: '' };

  function setFeaturedMetric(field: 'value' | 'label', value: string) {
    const next = { ...metric, [field]: value };
    onChange({
      ...project,
      featuredMetric: next.value.trim() === '' && next.label.trim() === '' ? undefined : next,
    });
  }

  function updateLink(index: number, next: ProjectLink) {
    onChange({ ...project, links: project.links.map((l, i) => (i === index ? next : l)) });
  }

  function addLink() {
    onChange({ ...project, links: [...project.links, { label: '', href: '', kind: 'repo' }] });
  }

  function removeLink(index: number) {
    onChange({ ...project, links: project.links.filter((_, i) => i !== index) });
  }

  return (
    <div className="border-line flex flex-col gap-4 border p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-text text-base">{project.name || '(untitled)'}</span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-muted text-xs underline disabled:opacity-30"
          >
            Move up
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="text-muted text-xs underline disabled:opacity-30"
          >
            Move down
          </button>
          <RemoveButton onClick={onRemove} label="Remove project" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Slug"
          hint="url-safe, used in ?project="
          {...bind(project, 'slug', onChange)}
        />
        <Field label="Name" {...bind(project, 'name', onChange)} />
      </div>

      <TextAreaField label="Tagline" rows={2} {...bind(project, 'tagline', onChange)} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Context — type"
          hint="e.g. 'Internship work'"
          value={project.context.type}
          onChange={(e) =>
            onChange({ ...project, context: { ...project.context, type: e.target.value } })
          }
        />
        <Field
          label="Context — source"
          hint="course code or employer"
          value={project.context.source}
          onChange={(e) =>
            onChange({ ...project, context: { ...project.context, source: e.target.value } })
          }
        />
      </div>

      <SelectField
        label="Status"
        value={project.status}
        options={STATUS_OPTIONS}
        onChange={(e) => onChange({ ...project, status: e.target.value as ProjectStatus })}
      />

      <TextAreaField
        label="The problem"
        hint="1-2 sentences"
        rows={2}
        {...bind(project, 'problem', onChange)}
      />
      <TextAreaField
        label="What I built"
        hint="2-4 sentences"
        rows={4}
        {...bind(project, 'built', onChange)}
      />
      <TextAreaField
        label="Architecture"
        hint="one flow step per line, optional"
        rows={4}
        {...bindList(project, 'architecture', onChange)}
      />
      <TextAreaField
        label="Outcome"
        hint="metric if one exists, honest scope statement otherwise"
        rows={2}
        {...bind(project, 'outcome', onChange)}
      />
      <TextAreaField
        label="Stack"
        hint="one tag per line"
        rows={3}
        {...bindList(project, 'stack', onChange)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Featured metric — value"
          hint="e.g. '26%', leave both blank to omit"
          value={metric.value}
          onChange={(e) => setFeaturedMetric('value', e.target.value)}
        />
        <Field
          label="Featured metric — label"
          hint="e.g. 'MAE improvement'"
          value={metric.label}
          onChange={(e) => setFeaturedMetric('label', e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(project.featured)}
          onChange={(e) => onChange({ ...project, featured: e.target.checked })}
        />
        <span className="text-muted">Featured (wide card in the grid)</span>
      </label>

      <div className="flex flex-col gap-3">
        <span className="text-muted text-sm">Links</span>
        {project.links.map((link, i) => (
          <div
            key={i}
            className="border-line grid grid-cols-1 gap-2 border p-3 sm:grid-cols-[1fr_2fr_auto_auto]"
          >
            <Field label="Label" {...bind(link, 'label', (next) => updateLink(i, next))} />
            <Field label="URL" {...bind(link, 'href', (next) => updateLink(i, next))} />
            <SelectField
              label="Kind"
              value={link.kind}
              options={LINK_KIND_OPTIONS}
              onChange={(e) =>
                updateLink(i, { ...link, kind: e.target.value as ProjectLink['kind'] })
              }
            />
            <RemoveButton onClick={() => removeLink(i)} />
          </div>
        ))}
        <AddButton onClick={addLink} label="Add link" />
      </div>
    </div>
  );
}
