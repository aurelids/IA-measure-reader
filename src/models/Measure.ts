import { Schema, model, Document } from 'mongoose';

interface IMeasure extends Document {
  measure_uuid: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: 'WATER' | 'GAS';
  measure_value: number;
  has_confirmed: boolean;
  image_url: string;
}

const MeasureSchema = new Schema<IMeasure>({
  measure_uuid: { type: String, required: true },
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
  measure_value: { type: Number, required: true },
  has_confirmed: { type: Boolean, default: false },
  image_url: { type: String, required: true },
});


export const Measure = model<IMeasure>('Measure', MeasureSchema);
