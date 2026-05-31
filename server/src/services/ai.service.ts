import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface Fact {
  id: string;
  text: string;
  source: string;
  embedding?: number[];
}

interface SimilarityResult extends Fact {
  score: number;
}

export class AIService {
  private static knowledgeBase: Fact[] = [];
  
  private static readonly SYSTEM_PROMPT = `
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

  private static readonly BIAS_KEYWORDS = [
    'best candidate', 
    'who should i vote for', 
    'which party', 
    'is bjp', 
    'is congress', 
    'modi vs', 
    'rahul vs', 
    'party is better', 
    'vote to', 
    'better party', 
    'who will win'
  ];

  /**
   * Initialize AI service and load knowledge base
   */
  static async initialize(): Promise<void> {
    const dataPath = path.join(__dirname, '../data/election_facts.json');
    
    if (fs.existsSync(dataPath)) {
      this.knowledgeBase = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      console.log(`📚 AI Service initialized with ${this.knowledgeBase.length} fact chunks.`);
      
      if (process.env.GEMINI_API_KEY) {
        await this.embedKnowledgeBase();
      }
    }
  }

  /**
   * Generate embeddings for knowledge base
   */
  private static async embedKnowledgeBase(): Promise<void> {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    for (const fact of this.knowledgeBase) {
      try {
        const result = await model.embedContent(fact.text);
        fact.embedding = result.embedding.values;
      } catch (err) {
        console.warn(`Failed to embed chunk ${fact.id}`);
      }
    }
    
    console.log('✅ Knowledge base embedded for RAG.');
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magA * magB);
  }

  /**
   * Retrieve relevant context from knowledge base using RAG
   */
  private static async getRelevantContext(query: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return "Default ECI guidelines apply.";
    }

    try {
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const queryEmbedding = (await model.embedContent(query)).embedding.values;

      const similarities: SimilarityResult[] = this.knowledgeBase
        .filter((f): f is Fact & { embedding: number[] } => !!f.embedding)
        .map(f => ({
          ...f,
          score: this.cosineSimilarity(queryEmbedding, f.embedding)
        }))
        .sort((a, b) => b.score - a.score);

      const topChunks = similarities.slice(0, 3);
      
      if (topChunks[0]?.score < 0.6) {
        return "No specific handbook entry found. Use general ECI guidelines.";
      }

      return topChunks.map(c => `${c.text} [Source: ${c.source}]`).join('\n\n');
    } catch (error) {
      console.error('RAG Error:', error);
      return "General ECI guidelines apply.";
    }
  }

  /**
   * Quick response using Flash model
   */
  static async askFlash(query: string): Promise<string> {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: this.SYSTEM_PROMPT 
    });

    const result = await model.generateContent(query);
    return result.response.text();
  }

  /**
   * Detailed response using Pro model with RAG context
   */
  static async deepAsk(query: string): Promise<string> {
    const context = await this.getRelevantContext(query);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: this.SYSTEM_PROMPT 
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

  /**
   * Check if query contains biased or opinion-seeking content
   */
  static isBiased(query: string): boolean {
    const q = query.toLowerCase();
    return this.BIAS_KEYWORDS.some(keyword => q.includes(keyword));
  }
}
