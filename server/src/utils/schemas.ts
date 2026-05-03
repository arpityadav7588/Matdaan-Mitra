import { z } from 'zod';

export const eligibilitySchema = z.object({
  hashedId: z.string().length(64, "Invalid Voter ID Hash format"),
});

export const candidateQuerySchema = z.object({
  constituency: z.string().min(1, "Constituency is required"),
});

export const processQuerySchema = z.object({
  lang: z.enum(['en', 'hi', 'ta', 'te']).default('en'),
});

export const voiceSchema = z.object({
  text: z.string().min(1),
  lang: z.enum(['en', 'hi', 'ta', 'te']),
});

export const chatSchema = z.object({
  query: z.string().min(1).max(500),
  mode: z.enum(['flash', 'pro']).default('flash'),
});
