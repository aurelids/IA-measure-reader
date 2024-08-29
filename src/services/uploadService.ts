// src/services/uploadService.ts

import { Request, Response } from 'express';
import { Measure } from '../models/Measure';
import { getMeasureFromImage } from './geminiService';  // Importe a função do Gemini
import { v4 as uuidv4 } from 'uuid';  // Importa a função para gerar UUIDs

export const uploadMeasure = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Validar o base64 da imagem e os parâmetros
    if (!image || !customer_code || !measure_datetime || !measure_type) {
        console.log('Invalid data provided');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Dados inválidos fornecidos.'
        });
    }

    // Verificar se já existe uma leitura no mês
    const existingMeasure = await Measure.findOne({
        customer_code,
        measure_type,
        measure_datetime: {
            $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1),
            $lt: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 1)
        }
    });

    if (existingMeasure) {
        return res.status(409).json({
            error_code: 'DOUBLE_REPORT',
            error_description: 'Leitura do mês já realizada.'
        });
    }

    try {
        // Integrar com a API de LLM (Google Gemini)
        const measure_value = await getMeasureFromImage(image);  // Chama a função que processa a imagem

        // Supondo que você tenha um link temporário para a imagem (se não tiver, remova isso ou implemente como precisar)
        const image_url = 'http://example.com/image.jpg'; // Exemplo
        const measure_uuid = uuidv4();  // Gerar um UUID novo

        const newMeasure = new Measure({
            measure_uuid,
            customer_code,
            measure_datetime: new Date(measure_datetime),
            measure_type,
            has_confirmed: false,
            image_url,
            measure_value
        });

        await newMeasure.save();

        res.status(200).json({
            image_url,
            measure_value,
            measure_uuid
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'Erro ao processar a imagem.'
        });
    }
};
