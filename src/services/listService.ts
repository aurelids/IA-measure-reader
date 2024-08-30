import { Measure } from '../models/Measure';

export const listMeasuresByCustomerCode = async (customer_code: string, measure_type?: string) => {
  const filter: any = { customer_code };

  if (measure_type) {
    filter.measure_type = { $regex: new RegExp(measure_type, 'i') };
  }

  const measures = await Measure.find(filter);
  return measures;
};
