export interface Mfo {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  logo: string;
  licenseNumber?: string;
  isActive: boolean;
  slug: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  rateMin: number;
  rateMax: number;
  approvalRate: number;
  decisionTime: string;
  isFirstLoanZero: boolean;
  isInstantApproval: boolean;
  isNoIncomeProof: boolean;
  is24Support: boolean;
  isSafeTransactions: boolean;
  isFlexibleTerms: boolean;
  ageFrom: number;
  ageTo: number;
  citizenship: string;
  documents: string;
  description: string;
  phone?: string;
  website: string;
  workTimeWeekdays: string;
  workTimeWeekend: string;
  workTimeOnline: string;
  createdAt: string;
  updatedAt: string;
}

export interface MfoLink {
  id: number;
  satelliteId: number;
  mfoId: number;
  mfo: Mfo;
}

export interface SatelliteKey {
  id: number;
  keyUk: string;
  keyRu: string;
  slugUk: string;
  slugRu: string;
  metaTitleUk: string;
  metaTitleRu: string;
  metaDescUk: string;
  metaDescRu: string;
  titleUk: string;
  titleRu: string;
  descriptionUk: string;
  descriptionRu: string;
  createdAt: string;
  updatedAt: string;
}

export interface MfoSatellite {
  id: number;
  keyId: number;
  metaTitleUk: string;
  metaTitleRu: string;
  metaDescUk: string;
  metaDescRu: string;
  titleUk: string;
  titleRu: string;
  descriptionUk: string;
  descriptionRu: string;
  slugUk: string;
  slugRu: string;
  createdAt: string;
  updatedAt: string;
  key: SatelliteKey;
  mfoLinks: MfoLink[];
}


export interface MfoSatellitePayload {
  satelliteName: string;
  description?: string;
  mfoId: number;
}
