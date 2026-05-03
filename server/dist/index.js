"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const schemas_1 = require("./utils/schemas");
const ai_service_1 = require("./services/ai.service");
const data_service_1 = require("./services/data.service");
const security_middleware_1 = require("./middleware/security.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 1. Core Security Headers (HSTS, CSP, etc.)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://storage.googleapis.com", "https://images.unsplash.com"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
        },
    },
}));
// 2. HTTPS Enforcement
app.use(security_middleware_1.SecurityMiddleware.forceHttps);
// 3. CORS configuration for Whitelisted Domains
const allowedOrigins = [
    'http://localhost:5173',
    process.env.VERCEL_DOMAIN || '',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('CORS Policy Block: Origin not whitelisted.'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '1mb' })); // Limit JSON payload size
// 4. Input Sanitization
app.use(security_middleware_1.SecurityMiddleware.sanitizeInput);
// 5. Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests. Please wait a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Guardrail Middleware for AI
const guardrailMiddleware = (req, res, next) => {
    const { query } = req.body;
    if (query && ai_service_1.AIService.isBiased(query)) {
        return res.json({
            success: true,
            response: "I can only provide factual election information. For opinions, please consult official sources."
        });
    }
    next();
};
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.post('/api/eligibility', (req, res) => {
    const validation = schemas_1.eligibilitySchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ success: false, errors: validation.error.format() });
    }
    const { hashedId } = validation.data;
    // Mock check for demo
    if (hashedId.startsWith('2d7116')) {
        return res.json({
            success: true,
            data: { name: 'Rahul Kumar', booth: 'Booth #12, KV Sector 2', date: '2026-06-01', verified: true }
        });
    }
    res.status(404).json({ success: false, message: 'No record found' });
});
app.get('/api/candidates', async (req, res) => {
    const validation = schemas_1.candidateQuerySchema.safeParse(req.query);
    if (!validation.success)
        return res.status(400).json({ success: false, errors: validation.error.format() });
    const data = await data_service_1.DataService.getCandidates(validation.data.constituency);
    res.json({ success: true, data });
});
app.get('/api/process', async (req, res) => {
    const validation = schemas_1.processQuerySchema.safeParse(req.query);
    if (!validation.success)
        return res.status(400).json({ success: false, errors: validation.error.format() });
    const data = await data_service_1.DataService.getVotingSteps(validation.data.lang);
    res.json({ success: true, data });
});
app.post('/api/upload', security_middleware_1.SecurityMiddleware.validateUpload, (req, res) => {
    res.json({
        success: true,
        message: 'Document uploaded securely.',
        url: 'https://storage.googleapis.com/matdaan-mitra/verified_doc.jpg'
    });
});
app.post('/api/ask', guardrailMiddleware, async (req, res) => {
    const validation = schemas_1.chatSchema.safeParse(req.body);
    if (!validation.success)
        return res.status(400).json({ success: false, errors: validation.error.format() });
    try {
        const response = await ai_service_1.AIService.askFlash(validation.data.query);
        res.json({ success: true, response });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'AI Assistant Busy' });
    }
});
app.get('/api/timeline', async (req, res) => {
    const data = await data_service_1.DataService.getTimeline();
    res.json({ success: true, data });
});
app.listen(PORT, async () => {
    await ai_service_1.AIService.initialize();
    console.log(`Matdaan Mitra Backend (TS) secured and running on port ${PORT}`);
});
