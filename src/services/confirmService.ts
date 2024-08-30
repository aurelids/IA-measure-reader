import { Measure } from '../models/Measure';

export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
  const measure = await Measure.findOne({ measure_uuid });

  if (!measure) {
    return null; 
  }

  if (measure.has_confirmed) {
    throw new Error('CONFIRMATION_DUPLICATE'); 
  }

  
  measure.measure_value = confirmed_value;
  measure.has_confirmed = true;
  await measure.save(); 

  return measure;
};
