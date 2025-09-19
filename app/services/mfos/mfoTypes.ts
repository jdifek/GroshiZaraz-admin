export interface PromoCode {
  code: string;
  discount: string;
  condition: string;
  validTill: string;
}

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
  dailyRate: number;       // ставка в день
  commission: number;      // комиссия
  approvalRate: number;
  collateral: string;      // залог
  decisionTime: string;
  decisionType: string;    // тип решения
  application: string;     // подача заявки

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

  promoCodes?: PromoCode[];

  createdAt: string;
  updatedAt: string;
  UtmLink: string;
}

// Массив promoCodes и новые поля включены
export type MfoPayload = Omit<Mfo, 'id' | 'createdAt' | 'updatedAt'>;