import path from 'path';  // Adicione esta linha
import { Measure } from '../models/Measure';
import { getMeasureFromImage } from './geminiService';
import { v4 as uuidv4 } from 'uuid';

interface UploadMeasureParams {
    image: string;
    customer_code: string;
    measure_datetime: string;
    measure_type: string;
    imagePath: string;
}

export const uploadMeasureService = async ({
    image,
    customer_code,
    measure_datetime,
    measure_type,
    imagePath
}: UploadMeasureParams) => {

    const existingMeasure = await Measure.findOne({
        customer_code,
        measure_type,
        measure_datetime: {
            $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1),
            $lt: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 1)
        }
    });

    if (existingMeasure) {
        throw new Error('Leitura do mês já realizada.');
    }

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

    return { measure_value, measure_uuid, image_url };
};
