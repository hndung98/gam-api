import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const whitelist = [
  'http://localhost:3000', // frontend dev
  'https://staging.mydomain.com', // staging
  'https://mydomain.com', // production
];

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
};
