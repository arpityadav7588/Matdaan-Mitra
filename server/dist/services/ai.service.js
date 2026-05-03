"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
class AIService {
    static knowledgeBase = [];
    static systemPrompt = `
    You are Matdaan Mitra, a strictly neutral AI assistant for the Election Commission of India.
    Your mission is to provide accurate, factual, and unbiased information about the Indian election process.

    STRICT GUIDELINES:
    1. FACTUAL ONLY: Only provide information based on the provided context or verified ECI guidelines.
    2. NEUTRALITY: Absolutely NO political opinions, party bias, or candidate endorsements. 
    3. REJECTION: If a query is politically charged, asks "who to vote for", or seeks opinions on parties/leaders, respond EXACTLY with:
       "I can only provide factual election information. For opinions, please consult official sources."
    4. CITATIONS: Every answer must cite the source from the context using the format: [Source: Name].
    5. MULTILINGUAL: If the user asks in Hindi, Tamil, or Telugu, respond accurately in that language while following all rules.
  `;
    static async initialize() {
        const dataPath = path_1.default.join(__dirname, '../data/election_facts.json');
        if (fs_1.default.existsSync(dataPath)) {
            this.knowledgeBase = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
            console.log(`📚 AI Service initialized with ${this.knowledgeBase.length} fact chunks.`);
            // Proactively embed chunks if API key is present
            if (process.env.GEMINI_API_KEY) {
                await this.embedKnowledgeBase();
            }
        }
    }
    static async embedKnowledgeBase() {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        for (const fact of this.knowledgeBase) {
            try {
                const result = await model.embedContent(fact.text);
                fact.embedding = result.embedding.values;
            }
            catch (err) {
                console.warn(`Failed to embed chunk ${fact.id}`);
            }
        }
        console.log('✅ Knowledge base embedded for RAG.');
    }
    static cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magA * magB);
    }
    static async getRelevantContext(query) {
        if (!process.env.GEMINI_API_KEY)
            return "Default ECI guidelines apply.";
        try {
            const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const queryEmbedding = (await model.embedContent(query)).embedding.values;
            const similarities = this.knowledgeBase
                .filter(f => f.embedding)
                .map(f => ({
                ...f,
                score: this.cosineSimilarity(queryEmbedding, f.embedding)
            }))
                .sort((a, b) => b.score - a.score);
            const topChunks = similarities.slice(0, 3);
            if (topChunks[0]?.score < 0.6)
                return "No specific handbook entry found. Use general ECI guidelines.";
            return topChunks.map(c => `${c.text} [Source: ${c.source}]`).join('\n\n');
        }
        catch (error) {
            console.error('RAG Error:', error);
            return "General ECI guidelines apply.";
        }
    }
    static async askFlash(query) {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: this.systemPrompt
        });
        const result = await model.generateContent(query);
        return result.response.text();
    }
    static async deepAsk(query) {
        const context = await this.getRelevantContext(query);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            systemInstruction: this.systemPrompt
        });
        const prompt = `
      CONTEXT FROM ECI HANDBOOKS:
      ${context}

      USER QUESTION:
      ${query}

      Provide a detailed, helpful, and neutral response citing the sources provided above.
    `;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
    static isBiased(query) {
        const biasKeywords = [
            'best candidate', 'who should i vote for', 'which party', 'is bjp', 'is congress',
            'modi vs', 'rahul vs', 'party is better', 'vote to', 'better party', 'who will win'
        ];
        const q = query.toLowerCase();
        return biasKeywords.some(keyword => q.includes(keyword));
    }
}
exports.AIService = AIService;
