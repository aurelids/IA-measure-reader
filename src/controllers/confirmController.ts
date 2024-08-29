import { Request, Response } from 'express';
import { confirmMeasure } from '../services/confirmService';

export const confirm = async (req: Request, res: Response) => {
  const { measure_uuid, confirmed_value } = req.body;

  // Validar o tipo de dados dos parâmetros enviados
  if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Dados fornecidos são inválidos.'
    });
  }

  try {
    const updatedMeasure = await confirmMeasure(measure_uuid, confirmed_value);

    if (!updatedMeasure) {
      return res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada.'
      });
    }

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'CONFIRMATION_DUPLICATE') {
        return res.status(409).json({
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura já confirmada.'
        });
      }

      return res.status(500).json({
        error_code: 'INTERNAL_ERROR',
        error_description: 'Erro ao confirmar leitura.',
      });
    }

    // Caso o erro não seja uma instância de Error
    return res.status(500).json({
      error_code: 'UNKNOWN_ERROR',
      error_description: 'Erro desconhecido ao confirmar leitura.',
    });
  }
};
