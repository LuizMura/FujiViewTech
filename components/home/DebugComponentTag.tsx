type DebugComponentTagProps = {
  name: string;
  enabled: boolean;
};

export default function DebugComponentTag({
  name,
  enabled,
}: DebugComponentTagProps) {
  if (!enabled) return null;

  return (
    <span className="pointer-events-none absolute left-2 top-2 z-50 rounded-md border border-amber-300 bg-amber-100/95 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900 shadow-sm md:text-xs">
      {name}
    </span>
  );
}
