import dotenv from "dotenv";
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config(); 

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('Chave da API não encontrada no arquivo .env');
}

const genAI = new GoogleGenerativeAI(apiKey);

function fileToGenerativePart(path: string, mimeType: string) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Qual número você vê na imagem?";

    const imageParts = [fileToGenerativePart('C:/Users/Gabriel Cogo/Desktop/Projetos/Shopper/desafio-shopper/numeros.jpeg', 'image/jpeg')];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    console.log("Texto retornado:", text);

    // Extraindo apenas o número da string retornada
    const match = text.match(/\d+/); // Encontra números na string

    if (match) {
        const number = parseInt(match[0], 10); // Converte para inteiro
        console.log("Número extraído:", number);
    } else {
        console.log("Nenhum número encontrado.");
    }
}

run();
