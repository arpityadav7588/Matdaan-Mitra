import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { eligibilitySchema, candidateQuerySchema, processQuerySchema, chatSchema } from './utils/schemas';
import { AIService } from './services/ai.service';
import { DataService } from './services/data.service';
import { SecurityMiddleware } from './middleware/security.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// Security Middleware Configuration
// ============================================================================

// 1. Core Security Headers (HSTS, CSP, etc.)
app.use(helmet({
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
app.use(SecurityMiddleware.forceHttps);

// 3. CORS configuration for Whitelisted Domains
const allowedOrigins = [
  'http://localhost:5173', 
  process.env.VERCEL_DOMAIN || '',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Block: Origin not whitelisted.'));
    }
  },
  credentials: true
}));

// 4. Input Sanitization
app.use(SecurityMiddleware.sanitizeInput);

// 5. Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ============================================================================
// AI Guardrail Middleware
// ============================================================================

const guardrailMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { query } = req.body;
  if (query && AIService.isBiased(query)) {
    res.json({ 
      success: true, 
      response: "I can only provide factual election information. For opinions, please consult official sources." 
    });
    return;
  }
  next();
};

// ============================================================================
// API Routes
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Check voter eligibility by hashed ID
 */
app.post('/api/eligibility', (req: Request, res: Response) => {
  const validation = eligibilitySchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }
  
  const { hashedId } = validation.data;
  
  // Mock check for demo
  if (hashedId.startsWith('2d7116')) {
    res.json({ 
      success: true, 
      data: { 
        name: 'Rahul Kumar', 
        booth: 'Booth #12, KV Sector 2', 
        date: '2026-06-01', 
        verified: true 
      } 
    });
    return;
  }
  
  res.status(404).json({ success: false, message: 'No record found' });
});

/**
 * Get candidates by constituency
 */
app.get('/api/candidates', async (req: Request, res: Response) => {
  const validation = candidateQuerySchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }
  
  const data = await DataService.getCandidates(validation.data.constituency);
  res.json({ success: true, data });
});

/**
 * Get voting process steps in specified language
 */
app.get('/api/process', async (req: Request, res: Response) => {
  const validation = processQuerySchema.safeParse(req.query);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  const data = await DataService.getVotingSteps(validation.data.lang as any);
  res.json({ success: true, data });
});

/**
 * Upload document endpoint (secured)
 */
app.post('/api/upload', SecurityMiddleware.validateUpload, (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Document uploaded securely.',
    url: 'https://storage.googleapis.com/matdaan-mitra/verified_doc.jpg'
  });
});

/**
 * AI chat endpoint with guardrails
 */
app.post('/api/ask', guardrailMiddleware, async (req: Request, res: Response) => {
  const validation = chatSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  try {
    const response = await AIService.askFlash(validation.data.query);
    res.json({ success: true, response });
  } catch (error) {
    console.error('AI Service Error:', error);
    res.status(500).json({ success: false, message: 'AI Assistant Busy' });
  }
});

/**
 * Get election timeline
 */
app.get('/api/timeline', async (req: Request, res: Response) => {
  const data = await DataService.getTimeline();
  res.json({ success: true, data });
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, async () => {
  await AIService.initialize();
  console.log(`Matdaan Mitra Backend (TS) secured and running on port ${PORT}`);
});
