// src/controllers/listController.ts
import { Request, Response } from 'express';
import { listMeasuresByCustomerCode } from '../services/listService';

export const list = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  
  try {
    const measures = await listMeasuresByCustomerCode(customer_code);
    if (measures.length === 0) {
      return res.status(404).json({ message: 'No measures found for this customer' });
    }
    return res.status(200).json(measures);
  } catch (error) {
    return res.status(500).json({ message: 'Error listing measures', error });
  }
};
