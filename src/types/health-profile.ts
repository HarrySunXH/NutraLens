// Health Profile Types for NutraLens

export interface HormoneLabData {
  testosterone?: number | null;
  estrogen?: number | null;
  cortisol?: number | null;
  insulin?: number | null;
  thyroidTSH?: number | null;
  thyroidT3?: number | null;
  thyroidT4?: number | null;
}

export interface VitaminLabData {
  vitaminD?: number | null;
  vitaminB12?: number | null;
  vitaminB6?: number | null;
  folate?: number | null;
  iron?: number | null;
  ferritin?: number | null;
}

export interface GeneralHealthLabData {
  glucose?: number | null;
  hba1c?: number | null;
  ldl?: number | null;
  hdl?: number | null;
  triglycerides?: number | null;
  totalCholesterol?: number | null;
  creatinine?: number | null;
  bun?: number | null;
}

export interface LabData {
  hormones: HormoneLabData;
  vitamins: VitaminLabData;
  generalHealth: GeneralHealthLabData;
}

export interface HealthGoals {
  weightManagement: boolean;
  appetiteControl: boolean;
  energy: boolean;
  sleep: boolean;
  stressRelief: boolean;
  fitness: boolean;
  muscleMass: boolean;
  strength: boolean;
  mentalPerformance: boolean;
  immunity: boolean;
  heartHealth: boolean;
  digestiveHealth: boolean;
  hormoneBalance: boolean;
  skinHair: boolean;
  longevity: boolean;
  painMitigation: boolean;
}

export type SexAtBirth = 'male' | 'female' | 'intersex' | 'prefer_not_to_say' | null;

export interface HealthProfile {
  // Demographics
  age: number | null;
  sexAtBirth: SexAtBirth;
  genderIdentity: string | null;
  
  // Medical History
  liverConditions: string[];
  kidneyConditions: string[];
  digestiveConditions: string[];
  otherConditions: string[];
  
  // Health Goals (multi-select)
  goals: HealthGoals;
  
  // Lab Data (all optional)
  labData: LabData;
  
  // Current Supplements
  currentSupplements: string[];

  // Custom Goals (user-typed)
  customGoals: string[];

  // Metadata
  completedAt: string | null;
  lastUpdated: string;
}

// Default empty profile
export const defaultHealthProfile: HealthProfile = {
  age: null,
  sexAtBirth: null,
  genderIdentity: null,
  liverConditions: [],
  kidneyConditions: [],
  digestiveConditions: [],
  otherConditions: [],
  goals: {
    weightManagement: false,
    appetiteControl: false,
    energy: false,
    sleep: false,
    stressRelief: false,
    fitness: false,
    muscleMass: false,
    strength: false,
    mentalPerformance: false,
    immunity: false,
    heartHealth: false,
    digestiveHealth: false,
    hormoneBalance: false,
    skinHair: false,
    longevity: false,
    painMitigation: false,
  },
  labData: {
    hormones: {},
    vitamins: {},
    generalHealth: {},
  },
  currentSupplements: [],
  customGoals: [],
  completedAt: null,
  lastUpdated: new Date().toISOString(),
};

// Lab reference ranges for display
export const labReferenceRanges = {
  hormones: {
    testosterone: { unit: 'ng/dL', maleRange: '300-1000', femaleRange: '15-70' },
    estrogen: { unit: 'pg/mL', maleRange: '10-40', femaleRange: '30-400' },
    cortisol: { unit: 'μg/dL', range: '6-23 (morning)' },
    insulin: { unit: 'μIU/mL', range: '2.6-24.9' },
    thyroidTSH: { unit: 'mIU/L', range: '0.4-4.0' },
    thyroidT3: { unit: 'pg/mL', range: '2.0-4.4' },
    thyroidT4: { unit: 'ng/dL', range: '0.8-1.8' },
  },
  vitamins: {
    vitaminD: { unit: 'ng/mL', range: '30-100' },
    vitaminB12: { unit: 'pg/mL', range: '200-900' },
    vitaminB6: { unit: 'ng/mL', range: '5-50' },
    folate: { unit: 'ng/mL', range: '2.7-17' },
    iron: { unit: 'μg/dL', range: '60-170' },
    ferritin: { unit: 'ng/mL', maleRange: '20-500', femaleRange: '20-200' },
  },
  generalHealth: {
    glucose: { unit: 'mg/dL', range: '70-100 (fasting)' },
    hba1c: { unit: '%', range: '< 5.7' },
    ldl: { unit: 'mg/dL', range: '< 100' },
    hdl: { unit: 'mg/dL', range: '> 40 (men), > 50 (women)' },
    triglycerides: { unit: 'mg/dL', range: '< 150' },
    totalCholesterol: { unit: 'mg/dL', range: '< 200' },
    creatinine: { unit: 'mg/dL', range: '0.7-1.3' },
    bun: { unit: 'mg/dL', range: '7-20' },
  },
};
