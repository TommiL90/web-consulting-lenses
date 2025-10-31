export const FRAME_TYPES = ["cerrado", "semicerrado", "al_aire"] as const;
export const LENS_MATERIALS = [
  "organico",
  "policarbonato",
  "mineral",
  "adelgazado",
] as const;
export const LENS_TYPES = ["monofocal", "bifocal", "multifocal"] as const;

export const FRAME_TYPE_LABELS: Record<(typeof FRAME_TYPES)[number], string> = {
  cerrado: "Marco cerrado",
  semicerrado: "Marco semicerrado",
  al_aire: "Marco al aire",
};

export const MATERIAL_LABELS: Record<
  (typeof LENS_MATERIALS)[number],
  string
> = {
  organico: "Orgánico",
  policarbonato: "Policarbonato",
  mineral: "Mineral",
  adelgazado: "Adelgazado",
};

export const LENS_TYPE_LABELS: Record<(typeof LENS_TYPES)[number], string> = {
  monofocal: "Monofocal",
  bifocal: "Bifocal",
  multifocal: "Multifocal",
};

export const LENS_FEATURES = [
  {
    key: "hasAntiReflective",
    label: "Antirreflejo",
    description: "Reduce reflejos y mejora la nitidez",
  },
  {
    key: "hasBlueFilter",
    label: "Filtro azul",
    description: "Protección frente a pantallas y luz azul",
  },
  {
    key: "isPhotochromic",
    label: "Fotocromático",
    description: "Oscurece automáticamente al sol",
  },
  {
    key: "hasUVProtection",
    label: "Protección UV",
    description: "Bloqueo total de rayos UV",
  },
  {
    key: "isPolarized",
    label: "Polarizado",
    description: "Reduce los reflejos intensos",
  },
  {
    key: "isMirrored",
    label: "Espejado",
    description: "Acabado reflectante exterior",
  },
] as const;
