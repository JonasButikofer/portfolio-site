import type { ChangeEvent } from 'react';

export function bind<T extends object>(obj: T, key: keyof T, set: (next: T) => void) {
  return {
    value: String(obj[key] ?? ''),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      set({ ...obj, [key]: e.target.value });
    },
  };
}

/** Binds a string[] field to a textarea, one item per line. */
export function bindList<T extends object>(obj: T, key: keyof T, set: (next: T) => void) {
  const arr = (obj[key] as unknown as string[] | undefined) ?? [];
  return {
    value: arr.join('\n'),
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
      set({ ...obj, [key]: e.target.value.split('\n') });
    },
  };
}

interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Field({ label, hint, value, onChange }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">
        {label}
        {hint && <span className="ml-2 text-xs opacity-70">{hint}</span>}
      </span>
      <input
        value={value}
        onChange={onChange}
        className="border-line bg-ink text-text focus-visible:outline-gold rounded-sm border px-3 py-2 outline-none"
      />
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  hint?: string;
  value: string;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextAreaField({ label, hint, value, rows = 3, onChange }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">
        {label}
        {hint && <span className="ml-2 text-xs opacity-70">{hint}</span>}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="border-line bg-ink text-text focus-visible:outline-gold rounded-sm border px-3 py-2 outline-none"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="border-line bg-ink text-text focus-visible:outline-gold rounded-sm border px-3 py-2 outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RemoveButton({
  onClick,
  label = 'Remove',
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-muted self-start text-xs underline decoration-transparent underline-offset-4 transition-colors hover:text-red-400 hover:decoration-red-400"
    >
      {label}
    </button>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-line text-text hover:border-gold hover:text-gold self-start rounded-sm border px-3 py-1.5 text-xs transition-colors"
    >
      + {label}
    </button>
  );
}
