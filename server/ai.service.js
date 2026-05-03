const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Load Knowledge Base
let ELECTION_KNOWLEDGE_BASE = "";
try {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/election_facts.json'), 'utf8'));
  ELECTION_KNOWLEDGE_BASE = JSON.stringify(data, null, 2);
} catch (error) {
  console.error("Failed to load knowledge base:", error);
}

async function getElectionInfo(query, mode = 'flash') {
  // Mode selection: 'pro' for complex reasoning, 'flash' for speed
  const modelName = mode === 'pro' ? "gemini-1.5-pro" : "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
    You are Matdaan Mitra, a strictly neutral AI election literacy assistant.
    Your mission is to provide accurate, factual, and unbiased information about the Indian Election process.

    INSTRUCTIONS:
    1. Use the provided Context (Knowledge Base) as your primary source of truth.
    2. If the query is complex or involves constitutional rights, explain them clearly.
    3. NEVER show political bias. Do not favor any party, candidate, or ideology.
    4. Cite official sources like "eci.gov.in" when providing data outside the context.
    5. Keep the tone helpful, encouraging, and easy to understand for first-time voters.
    6. If the user asks for a political opinion, politely decline and offer factual election information instead.

    CONTEXT (ELECTION KNOWLEDGE BASE):
    ${ELECTION_KNOWLEDGE_BASE}

    USER QUERY: ${query}
    
    RESPONSE (Markdown format):
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(`Gemini ${modelName} Error:`, error);
    throw error;
  }
}

module.exports = { getElectionInfo };

