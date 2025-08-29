import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const whitelist = [
  'http://localhost:3000', // localhost 3000
  'http://127.0.0.1:3000', // local IP 3000
  'http://localhost:5000', // localhost 5000
  'http://127.0.0.1:5000', // local IP 5000
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
