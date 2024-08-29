// src/services/geminiService.ts
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('Chave da API não encontrada no arquivo .env');
}

const genAI = new GoogleGenerativeAI(apiKey);

function removeBase64Prefix(base64String: string): string {
    const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, '');
    return base64Data;
}

async function getMeasureFromImage(base64Image: string): Promise<number> {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const cleanBase64Image = removeBase64Prefix(base64Image);

    const imagePart = {
        inlineData: {
            data: cleanBase64Image,
            mimeType: 'image/jpeg',  // Certifique-se de que o mimeType está correto
        },
    };

    const prompt = "Qual número você vê na imagem?";
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = await response.text();

    console.log("Texto retornado:", text);

    // Extraindo apenas o número da string retornada
    const match = text.match(/\d+/); // Encontra números na string

    if (match) {
        const number = parseInt(match[0], 10); // Converte para inteiro
        console.log("Número extraído:", number);
        return number;
    } else {
        throw new Error("Nenhum número encontrado.");
    }
}

export { getMeasureFromImage };