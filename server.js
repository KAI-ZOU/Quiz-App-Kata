import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

/* Note: for this section, I found https://developer.mozilla.org/en-US/docs/Web/JavaScript subsection - Web API's to be super helpful */

// we load the env file and the API key
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Intialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.post("/api/generate-quiz", async (req, res) => {
    try {
        const { prompt } = req.body;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `
Generate a quiz in JSON array format.

Each question must include:
- "question": string
- "correct_answer": string
- "incorrect_answers": [string, string, string]

Prompt to base questions on:
${prompt}

Output ONLY valid JSON.
`
                }
            ]
        });

        const content = completion.choices[0].message.content;
        res.json({ content });
    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Failed to generate quiz." });
    }
});

// starting expressjs server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});