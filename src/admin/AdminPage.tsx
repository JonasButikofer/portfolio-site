import { useEffect, useState, type ReactNode } from 'react';
import type { CapabilityGroup, Contact, ExperienceEntry, Person } from '@/data/site';
import type { Project } from '@/data/projects';
import { AddButton, bind, bindList, Field, RemoveButton, TextAreaField } from './fields';
import { ProjectsSection } from './ProjectsSection';

interface SiteContent {
  domain: string;
  person: Person;
  contact: Contact;
  capabilityGroups: CapabilityGroup[];
  econometricsNote: string;
  experience: ExperienceEntry[];
}

interface AdminContent {
  site: SiteContent;
  projects: Project[];
}

type SaveStatus = 'loading' | 'idle' | 'saving' | 'saved' | 'error';

export function AdminPage() {
  const [content, setContent] = useState<AdminContent | null>(null);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/__admin/api/content')
      .then((r) => r.json())
      .then((data: AdminContent) => {
        setContent(data);
        setStatus('idle');
      })
      .catch((err: unknown) => {
        setError(String(err));
        setStatus('error');
      });
  }, []);

  async function handleSave() {
    if (!content) return;
    setStatus('saving');
    try {
      const res = await fetch('/__admin/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('saved');
      setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 2500);
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }

  if (status === 'loading') {
    return <div className="bg-ink text-text min-h-screen p-10">Loading content…</div>;
  }

  if (!content) {
    return (
      <div className="bg-ink min-h-screen p-10 text-red-400">
        Couldn't load content: {error}
        <br />
        Is `npm run dev` (not `npm run build`/`preview`) running? The admin API only exists in the
        dev server.
      </div>
    );
  }

  const { site, projects } = content;

  function setSite(next: SiteContent) {
    setContent({ site: next, projects });
  }

  function setProjects(next: Project[]) {
    setContent({ site, projects: next });
  }

  return (
    <div className="bg-ink text-text font-body min-h-screen">
      <header className="border-line bg-ink sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
        <div>
          <h1 className="font-display text-base font-semibold">Content admin</h1>
          <p className="text-muted text-xs">
            Dev-only. Writes straight to src/data/*.json. Not part of the deployed site.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {status === 'saved' && <span className="text-xs text-emerald-400">Saved</span>}
          {status === 'error' && <span className="text-xs text-red-400">Save failed: {error}</span>}
          <a
            href="/"
            className="text-muted text-xs underline decoration-transparent hover:decoration-current"
          >
            View site
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className="bg-gold text-ink rounded-sm px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving…' : 'Save all changes'}
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-10">
        <IdentitySection person={site.person} onChange={(p) => setSite({ ...site, person: p })} />
        <ContactSection contact={site.contact} onChange={(c) => setSite({ ...site, contact: c })} />
        <CapabilitiesSection
          groups={site.capabilityGroups}
          onChange={(g) => setSite({ ...site, capabilityGroups: g })}
          econometricsNote={site.econometricsNote}
          onNoteChange={(n) => setSite({ ...site, econometricsNote: n })}
        />
        <ExperienceSection
          entries={site.experience}
          onChange={(e) => setSite({ ...site, experience: e })}
        />
        <ProjectsSection projects={projects} onChange={setProjects} />
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-gold text-lg">{title}</h2>
      {children}
    </section>
  );
}

function IdentitySection({ person, onChange }: { person: Person; onChange: (p: Person) => void }) {
  return (
    <Section title="Identity">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Name" {...bind(person, 'name', onChange)} />
        <Field label="Role" {...bind(person, 'role', onChange)} />
      </div>
      <TextAreaField
        label="Positioning line"
        hint="one sentence, hero subheading"
        rows={2}
        {...bind(person, 'positioningLine', onChange)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Location" {...bind(person, 'location', onChange)} />
        <Field label="Open to" {...bind(person, 'openTo', onChange)} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Graduation" {...bind(person, 'graduation', onChange)} />
        <Field label="Degree" {...bind(person, 'degree', onChange)} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Minor" {...bind(person, 'minor', onChange)} />
        <Field label="School" {...bind(person, 'school', onChange)} />
      </div>
      <Field label="GPA line" {...bind(person, 'gpa', onChange)} />
      <Field label="Certification" {...bind(person, 'certification', onChange)} />
    </Section>
  );
}

function ContactSection({
  contact,
  onChange,
}: {
  contact: Contact;
  onChange: (c: Contact) => void;
}) {
  return (
    <Section title="Contact">
      <Field label="GitHub URL" {...bind(contact, 'githubUrl', onChange)} />
      <Field label="LinkedIn URL" {...bind(contact, 'linkedinUrl', onChange)} />
      <Field label="Email" {...bind(contact, 'email', onChange)} />
      <Field
        label="Resume path"
        hint="usually /resume.pdf"
        {...bind(contact, 'resumeHref', onChange)}
      />
    </Section>
  );
}

function CapabilitiesSection({
  groups,
  onChange,
  econometricsNote,
  onNoteChange,
}: {
  groups: CapabilityGroup[];
  onChange: (g: CapabilityGroup[]) => void;
  econometricsNote: string;
  onNoteChange: (n: string) => void;
}) {
  function updateGroup(index: number, next: CapabilityGroup) {
    onChange(groups.map((g, i) => (i === index ? next : g)));
  }
  function addGroup() {
    onChange([...groups, { title: 'New group', items: [] }]);
  }
  function removeGroup(index: number) {
    onChange(groups.filter((_, i) => i !== index));
  }

  return (
    <Section title="Capabilities">
      {groups.map((group, i) => (
        <div key={i} className="border-line flex flex-col gap-3 border p-4">
          <Field label="Group title" {...bind(group, 'title', (next) => updateGroup(i, next))} />
          <TextAreaField
            label="Items"
            hint="one per line"
            rows={5}
            {...bindList(group, 'items', (next) => updateGroup(i, next))}
          />
          <RemoveButton onClick={() => removeGroup(i)} label="Remove group" />
        </div>
      ))}
      <AddButton onClick={addGroup} label="Add group" />
      <TextAreaField
        label="Econometrics note"
        hint="one line, shown under the capability groups"
        rows={2}
        value={econometricsNote}
        onChange={(e) => onNoteChange(e.target.value)}
      />
    </Section>
  );
}

function ExperienceSection({
  entries,
  onChange,
}: {
  entries: ExperienceEntry[];
  onChange: (e: ExperienceEntry[]) => void;
}) {
  function updateEntry(index: number, next: ExperienceEntry) {
    onChange(entries.map((e, i) => (i === index ? next : e)));
  }
  function addEntry() {
    onChange([...entries, { org: '', title: '', location: '', start: '', end: 'present' }]);
  }
  function removeEntry(index: number) {
    onChange(entries.filter((_, i) => i !== index));
  }

  return (
    <Section title="Experience">
      {entries.map((entry, i) => (
        <div key={i} className="border-line flex flex-col gap-3 border p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Organization" {...bind(entry, 'org', (next) => updateEntry(i, next))} />
            <Field label="Title" {...bind(entry, 'title', (next) => updateEntry(i, next))} />
          </div>
          <Field label="Location" {...bind(entry, 'location', (next) => updateEntry(i, next))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" {...bind(entry, 'start', (next) => updateEntry(i, next))} />
            <Field
              label="End"
              hint="'present' or a date"
              {...bind(entry, 'end', (next) => updateEntry(i, next))}
            />
          </div>
          <Field label="Note (optional)" {...bind(entry, 'note', (next) => updateEntry(i, next))} />
          <RemoveButton onClick={() => removeEntry(i)} label="Remove entry" />
        </div>
      ))}
      <AddButton onClick={addEntry} label="Add experience entry" />
    </Section>
  );
}
