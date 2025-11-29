// netlify/functions/generate.js
import fetch from 'node-fetch';

// Hàm handler chính cho Netlify Function
export async function handler(event, context) {
    // Chỉ cho phép phương thức POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt, image, imageMimeType } = JSON.parse(event.body);
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: { message: 'API key for Gemini is not configured on the server.' } })
            };
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const promptText = `Based on the user's description and/or the provided image, generate valid scratchblocks syntax for Scratch 3.0... User's description: "${prompt}"`; // (Giữ nguyên prompt dài của bạn)

        const parts = [{ "text": promptText }];
        if (image && imageMimeType) {
            parts.push({
                "inline_data": { "mime_type": imageMimeType, "data": image }
            });
        }

        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "contents": [{ "parts": parts }] })
        });

        const data = await geminiResponse.json();

        if (!geminiResponse.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.error('Gemini API Error:', data);
            const errorMessage = data?.error?.message || 'Invalid response from Gemini API.';
            return {
                statusCode: geminiResponse.status || 500,
                body: JSON.stringify({ error: { message: errorMessage } })
            };
        }

        const generatedCode = data.candidates[0].content.parts[0].text;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ code: generatedCode })
        };

    } catch (error) {
        console.error('Server Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: 'An internal server error occurred in the function.' } })
        };
    }
}
