import * as dotenv from 'dotenv';

dotenv.config();

export interface LLMService {
    complete(prompt: string): Promise<string>;
}

export class OpenAILLMService implements LLMService {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = 'gpt-4o') {
        this.apiKey = apiKey;
        this.model = model;
    }

    async complete(prompt: string): Promise<string> {
        if (!this.apiKey) {
            // Fallback for testing without API key
            console.warn("No API Key provided, returning mock response.");
            return JSON.stringify({
                nodes: [
                    { type: "PAPER", name: "3D Gaussian Splatting", properties: { year: 2023 } },
                    { type: "METHOD", name: "Gaussian Splatting", properties: {} }
                ],
                edges: [
                    { source: "3D Gaussian Splatting", target: "Gaussian Splatting", type: "INTRODUCES", properties: {} }
                ]
            });
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: "system", content: "You are a helpful assistant that extracts knowledge graph structures from academic text. Output JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`LLM API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}
