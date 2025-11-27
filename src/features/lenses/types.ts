import type { FRAME_TYPES, LENS_MATERIALS, LENS_TYPES } from "./constants";

export type FrameType = (typeof FRAME_TYPES)[number];
export type LensMaterial = (typeof LENS_MATERIALS)[number];
export type LensType = (typeof LENS_TYPES)[number];

export type LensProductFeatures = {
  hasAntiReflective: boolean;
  hasBlueFilter: boolean;
  isPhotochromic: boolean;
  hasUVProtection: boolean;
  isPolarized: boolean;
  isMirrored: boolean;
};

export type LensFeatureKey = keyof LensProductFeatures;

export type LensPricing = {
  basePrice: number;
  finalPrice: number;
};

export type LensProduct = {
  id: string;
  sku: string;
  name: string;
  material: LensMaterial;
  tipo: LensType;
  frameType: FrameType;
  features: LensProductFeatures;
  pricing: LensPricing;
  costPrice?: number | null;
  deliveryDays: number;
  observations: string | null;
  available: boolean;
  prescriptionRangeId: string;
  prescriptionRange: PrescriptionRange;
  createdAt: string;
  updatedAt: string;
};

export type EyePrescription = {
  sphere: number;
  cylinder: number;
};

export type Prescription = {
  od: EyePrescription;
  oi: EyePrescription;
};

export type QuoteFilters = {
  frameType: FrameType;
  material?: LensMaterial;
  hasBlueFilter?: boolean;
  isPhotochromic?: boolean;
  hasAntiReflective?: boolean;
  isPolarized?: boolean;
  tipo?: LensType;
};

export type QuoteRequest = {
  prescription: Prescription;
  filters: QuoteFilters;
};

export type QuoteMeta = {
  originalPrescription: Prescription;
  normalizedPrescription: Prescription;
  prescriptionRangeUsed: {
    code: string;
    description: string;
  };
  totalResults: number;
  filtersApplied: Record<string, unknown>;
};

export type QuoteResponse = {
  results: LensProduct[];
  meta: QuoteMeta;
};

export type PrescriptionRange = {
  id: string;
  code: string;
  description: string;
  minEyeMaxSphere: number;
  minEyeMaxCylinder: number;
  maxEyeMaxSphere: number;
  maxEyeMaxCylinder: number;
  createdAt: string;
  updatedAt: string;
};
