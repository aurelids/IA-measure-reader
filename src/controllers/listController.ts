import { Request, Response } from 'express';
import { listMeasuresByCustomerCode } from '../services/listService';

export const list = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase())) {
    return res.status(400).json({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida',
    });
  }

  try {
    const measures = await listMeasuresByCustomerCode(customer_code, measure_type as string);

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return res.status(200).json({
      customer_code,
      measures: measures.map(measure => ({
        measure_uuid: measure.measure_uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
        description: 'Operação realizada com sucesso.'
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro ao listar medições',
    });
  }
};
