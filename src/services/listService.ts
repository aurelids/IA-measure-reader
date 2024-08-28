// src/services/listService.ts
import { Measure } from '../models/Measure';

export const listMeasuresByCustomerCode = async (customer_code: string) => {
  const measures = await Measure.find({ customer_code });
  return measures;
};
