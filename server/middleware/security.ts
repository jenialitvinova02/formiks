import cors, { CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';

const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

function getAllowedOrigins(): string[] {
  const rawOrigins = process.env.CORS_ORIGIN?.trim();
  if (!rawOrigins) {
    return defaultOrigins;
  }

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = new Set(getAllowedOrigins());

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients like curl/Postman and server-to-server calls.
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin is not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
});

export const corsMiddleware = cors(corsOptions);
