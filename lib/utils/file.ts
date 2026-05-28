export function buildSafeStorageFileName(originalName: string) {
  const trimmed = String(originalName || "").trim();
  const dotIndex = trimmed.lastIndexOf(".");
  const hasExt = dotIndex > 0 && dotIndex < trimmed.length - 1;
  const rawBase = hasExt ? trimmed.slice(0, dotIndex) : trimmed;
  const rawExt = hasExt ? trimmed.slice(dotIndex + 1) : "";

  const safeBase = rawBase
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const safeExt = rawExt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  const base = safeBase || "arquivo";
  const suffix = Date.now();

  return safeExt ? `${base}-${suffix}.${safeExt}` : `${base}-${suffix}`;
}
