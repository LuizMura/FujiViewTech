type DebugComponentTagProps = {
  name: string;
  enabled: boolean;
};

export default function DebugComponentTag({
  name,
  enabled,
}: DebugComponentTagProps) {
  if (!enabled) {
    return null;
  }

  return (
    <span className="pointer-events-none absolute left-2 top-2 z-40 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
      {name}
    </span>
  );
}
