// src/controllers/confirmController.ts
import { Request, Response } from 'express';
import { confirmMeasure } from '../services/confirmService';

export const confirm = async (req: Request, res: Response) => {
  const { measure_uuid } = req.body;
  
  try {
    const updatedMeasure = await confirmMeasure(measure_uuid);
    if (!updatedMeasure) {
      return res.status(404).json({ message: 'Measure not found' });
    }
    return res.status(200).json(updatedMeasure);
  } catch (error) {
    return res.status(500).json({ message: 'Error confirming measure', error });
  }
};
