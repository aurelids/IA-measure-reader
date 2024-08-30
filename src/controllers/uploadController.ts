import { Request, Response } from 'express';
import { Measure } from '../models/Measure';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { getMeasureFromImage } from '../services/geminiService';


function createTempImage(base64Image: string): string {
    const fileName = `${crypto.randomBytes(16).toString('hex')}.jpg`; 
    const filePath = path.join(__dirname, '../temp', fileName); 

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath));
    }

    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(filePath, base64Data, 'base64');

    return filePath;
}

export const uploadMeasureController = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        console.log('Invalid data provided');
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Dados inválidos fornecidos.'
        });
    }

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
            error_description: 'Já existe uma leitura para esse tipo no mês atual'
        });
    }

    const imagePath = createTempImage(image);

    try {
        const measure_value = await getMeasureFromImage(image); 
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
            measure_uuid,
            description: 'Operação realizada com sucesso'
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'Erro ao processar a imagem.'
        });
    }
};
