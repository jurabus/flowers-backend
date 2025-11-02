import dotenv from 'dotenv';
dotenv.config();

const req = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env var: ${k}`);
  return v;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  mongoUri: req('MONGO_URI'),
  jwtSecret: req('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: (process.env.CLIENT_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  firebase: {
    projectId: req('FIREBASE_PROJECT_ID'),
    clientEmail: req('FIREBASE_CLIENT_EMAIL'),
    privateKey: req('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    storageBucket: req('FIREBASE_STORAGE_BUCKET'),
  }
};
