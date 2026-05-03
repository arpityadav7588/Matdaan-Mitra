"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = exports.voiceSchema = exports.processQuerySchema = exports.candidateQuerySchema = exports.eligibilitySchema = void 0;
const zod_1 = require("zod");
exports.eligibilitySchema = zod_1.z.object({
    hashedId: zod_1.z.string().length(64, "Invalid Voter ID Hash format"),
});
exports.candidateQuerySchema = zod_1.z.object({
    constituency: zod_1.z.string().min(1, "Constituency is required"),
});
exports.processQuerySchema = zod_1.z.object({
    lang: zod_1.z.enum(['en', 'hi', 'ta', 'te']).default('en'),
});
exports.voiceSchema = zod_1.z.object({
    text: zod_1.z.string().min(1),
    lang: zod_1.z.enum(['en', 'hi', 'ta', 'te']),
});
exports.chatSchema = zod_1.z.object({
    query: zod_1.z.string().min(1).max(500),
    mode: zod_1.z.enum(['flash', 'pro']).default('flash'),
});
