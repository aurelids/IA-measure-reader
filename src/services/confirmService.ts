// src/services/confirmService.ts
import { Measure } from '../models/Measure';

export const confirmMeasure = async (measure_uuid: string) => {
  const measure = await Measure.findOneAndUpdate(
    { measure_uuid },
    { has_confirmed: true },
    { new: true }
  );
  return measure;
};
