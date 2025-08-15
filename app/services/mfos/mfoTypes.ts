export interface Mfo {
  id: number;
  name: string;
  slug: string;
  rating: number;
  reviews: number;
  logo: string;
  licenseNumber?: string;
  isActive: boolean;

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

  description?: string;
  phone?: string;
  website?: string;
  workTimeWeekdays?: string;
  workTimeWeekend?: string;
  workTimeOnline?: string;

  createdAt: string;
  updatedAt: string;
}

export type MfoPayload = Omit<Mfo, 'id' | 'createdAt' | 'updatedAt'>;
