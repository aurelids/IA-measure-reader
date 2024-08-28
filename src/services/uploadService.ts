import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY;
const apiUrl = 'https://api.gemini.com'; 

export const getMeasurementFromImage = async (imageBase64: string) => {
  try {
    const response = await axios.post(`${apiUrl}/your-endpoint`, {
      image: imageBase64,
      
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
