# Matdaan Mitra (मदान मित्र) 🗳️

Matdaan Mitra is an AI-powered election literacy companion for Indian voters, built for **PromptWars Virtual hackathon Challenge 2**.

## 🌟 Features
- **Animated Election Timeline**: Visualizes the journey from registration to results.
- **Secure Eligibility Checker**: Verify your voter status using SHA-256 hashed IDs for privacy.
- **Multilingual AI Assistant**: Powered by Gemini 1.5 Flash/Pro, supporting Hindi, Tamil, and Telugu.
- **High-Performance Rendering**: Uses `@chenglou/pretext` for zero-reflow text layout on low-end devices.
- **Voice Mode**: Native browser-based text-to-speech for accessibility.
- **Candidate Lookup**: Neutral info cards for candidate transparency.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Firebase (Mocked), Gemini API.
- **Layout**: `@chenglou/pretext` for canvas-based text measurement.
- **Security**: SHA-256 Hashing, Helmet, Rate Limiting.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Google AI Studio API Key (for Gemini)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/matdaan-mitra.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env` and add your `GEMINI_API_KEY`.

4. Run the app:
   ```bash
   npm run dev
   ```

## 📐 Architecture
The project follows a multi-agent orchestrated architecture, designed by:
- **@agency-ui-designer**: Visual system & Design tokens.
- **@agency-frontend-developer**: UI Components & Transitions.
- **@agency-backend-architect**: API & Data Strategy.
- **@agency-ai-engineer**: LLM & RAG Integration.
- **@agency-security-engineer**: Security & Privacy compliance.

---
Built with ❤️ for Indian Democracy.
