import { Model } from "mongoose";

export interface IBannerMessage {
  text: string;
  isActive: boolean;
  order: number;
  icon?: string;
}

export interface IBannerMessageModel extends Model<IBannerMessage> {
  someThink(any: number): string;
}