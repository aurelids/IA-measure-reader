import { Request, Response } from 'express';
import { Measure } from '../models/Measure';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getMeasureFromImage } from '../services/geminiService';  // Importe a função do Gemini

// Função para criar um arquivo temporário com base64
function createTempImage(base64Image: string): string {
    const fileName = `${crypto.randomBytes(16).toString('hex')}.jpg`; // Gera um nome único para o arquivo
    const filePath = path.join(__dirname, '../temp', fileName); // Caminho do arquivo temporário

    // Cria o diretório temp se não existir
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath));
    }

    // Remove o prefixo da base64 e escreve a imagem no arquivo
    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(filePath, base64Data, 'base64');

    return filePath;
}

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

    // Criar um arquivo temporário com a imagem base64
    const imagePath = createTempImage(image);

    try {
        // Integrar com a API de LLM (Google Gemini)
        const measure_value = await getMeasureFromImage(image);  // Chama a função que processa a imagem

        // Gerar um UUID novo e criar a URL para a imagem
        const measure_uuid = uuidv4();
        const image_url = `http://localhost:3000/temp/${path.basename(imagePath)}`;

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
