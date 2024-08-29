import { Measure } from '../models/Measure';

export const confirmMeasure = async (measure_uuid: string, confirmed_value: number) => {
  const measure = await Measure.findOne({ measure_uuid });

  if (!measure) {
    return null; // Medição não encontrada
  }

  if (measure.has_confirmed) {
    throw new Error('CONFIRMATION_DUPLICATE'); // Medição já confirmada
  }

  // Atualiza o valor confirmado e marca como confirmado
  measure.measure_value = confirmed_value;
  measure.has_confirmed = true;
  await measure.save(); // Salva a medição atualizada

  return measure;
};
