// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '.')));
app.use(express.json({ limit: '10mb' }));

app.post('/api/generate', async (req, res) => {
    const { prompt, image, imageMimeType } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: { message: 'API key for Gemini is not configured on the server.' } });
    }

    try {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const promptText = `Based on the user's description and/or the provided image, generate valid scratchblocks syntax for Scratch 3.0. If an image is provided, analyze it to create the script. For example, if the image is a drawing of a cat chasing a mouse, create a script for that. Generate the code in the language that corresponds to the user's request (English or Vietnamese). Only return the raw code, without explanations or markdown formatting like \`\`\`scratch. User's description: "${prompt}"`;

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

        if (!geminiResponse.ok || !data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
            console.error('Gemini API Error or invalid response structure:', data);
            const errorMessage = data?.error?.message || 'Invalid response structure from Gemini API.';
            return res.status(geminiResponse.status || 500).json({ error: { message: errorMessage } });
        }

        const generatedCode = data.candidates[0].content.parts[0].text;
        res.json({ code: generatedCode });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: { message: 'An internal server error occurred.' } });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});