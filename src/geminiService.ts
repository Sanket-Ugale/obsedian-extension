import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Vulnerability {
    line: number;
    message: string;
    severity: 'High' | 'Medium' | 'Low';
}

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    }

    async testConnection(): Promise<void> {
        try {
            // @ts-ignore
            if (this.genAI.listModels) {
                console.log("Testing connection to Gemini API...");
                // @ts-ignore
                const models = await this.genAI.listModels();
                console.log("--------------------------------------------------");
                console.log("AVAILABLE MODELS:");
                // @ts-ignore
                for (const m of models) {
                    // @ts-ignore
                    console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods})`);
                }
                console.log("--------------------------------------------------");
            } else {
                console.log("listModels method not found on GoogleGenerativeAI instance.");
            }
        } catch (error) {
            console.error("FAILED TO LIST MODELS:", error);
        }
    }

    async analyzeCode(code: string, filename: string): Promise<Vulnerability[]> {
        const prompt = `You are a security expert. Analyze the following code for security vulnerabilities and malicious patterns.
Filename: ${filename}

Code:
\`\`\`
${code}
\`\`\`

Return ONLY a valid JSON array of objects. Each object must have:
- "line": The line number (1-based integer) where the issue is located.
- "message": A concise description of the vulnerability.
- "severity": One of "High", "Medium", "Low".

Example output:
[{"line": 10, "message": "Hardcoded password found", "severity": "High"}]

If no vulnerabilities are found, return [].
Do not wrap the output in markdown code blocks. Just the raw JSON string.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up potential markdown formatting
            text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

            const vulnerabilities: Vulnerability[] = JSON.parse(text);
            return vulnerabilities;
        } catch (error) {
            console.error("Error analyzing code:", error);
            // Try to list models to help debugging
            try {
                // @ts-ignore
                if (this.genAI.listModels) {
                    // @ts-ignore
                    const models = await this.genAI.listModels();
                    console.log("Available models:", models);
                }
            } catch (e) {
                console.error("Could not list models:", e);
            }
            return [];
        }
    }
}
