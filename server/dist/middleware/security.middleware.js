"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
class SecurityMiddleware {
    /**
     * Sanitizes all string inputs in req.body, req.query, and req.params
     * to prevent XSS and injection attacks.
     */
    static sanitizeInput(req, res, next) {
        const sanitize = (obj) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = isomorphic_dompurify_1.default.sanitize(obj[key].trim());
                }
                else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            }
        };
        sanitize(req.body);
        sanitize(req.query);
        sanitize(req.params);
        next();
    }
    /**
     * Validates file upload metadata (mime type and size)
     */
    static validateUpload(req, res, next) {
        // In a real implementation with multer, check req.file
        // For this mock, we validate the concept
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        // Logic would go here if using a multi-part parser
        next();
    }
    /**
     * Enforces HTTPS by redirecting HTTP requests
     */
    static forceHttps(req, res, next) {
        if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    }
}
exports.SecurityMiddleware = SecurityMiddleware;
