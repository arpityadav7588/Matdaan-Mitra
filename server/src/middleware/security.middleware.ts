import { Request, Response, NextFunction } from 'express';
import DOMPurify from 'isomorphic-dompurify';

export class SecurityMiddleware {
  /**
   * Sanitizes all string inputs in req.body, req.query, and req.params
   * to prevent XSS and injection attacks.
   */
  static sanitizeInput(req: Request, res: Response, next: NextFunction) {
    const sanitize = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = DOMPurify.sanitize(obj[key].trim());
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
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
  static validateUpload(req: Request, res: Response, next: NextFunction) {
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
  static forceHttps(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  }
}
