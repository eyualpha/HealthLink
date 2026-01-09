import { useEffect, useMemo, useRef, useState } from 'react';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
}

export default function SearchableSelect({ options, value, onChange, placeholder, id }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    // keep query in sync when external value changes
    // Only update when different to avoid unnecessary renders.
    // This update is intentional to reflect external `value` changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value !== query) setQuery(value || '');
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg"
        aria-autocomplete="list"
        aria-expanded={open}
      />

      {open && (
        <ul className="absolute z-40 mt-1 w-full max-h-48 overflow-auto bg-white border rounded-lg shadow-sm">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500">No results</li>
          ) : (
            filtered.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setQuery(opt);
                  setOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                role="option"
              >
                {opt}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
