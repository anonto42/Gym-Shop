
export interface ICreateOfferInput {
  title: string;
  shortNote: string;
  promoCode: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface IUpdateOfferInput {
  title?: string;
  shortNote?: string;
  promoCode?: string;
  discount?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface IOfferResponse<T = unknown> {
  isError: boolean;
  status: number;
  message: string;
  data?: T | unknown;
}