// /src/config/env.js
import dotenv from "dotenv";
dotenv.config();

function req(k, optional = false) {
  const v = process.env[k];
  if (!v && !optional) {
    throw new Error(`Missing env var: ${k}`);
  }
  return v;
}

export const env = {
  firebase: {
    projectId: req("FIREBASE_PROJECT_ID"),
    clientEmail: req("FIREBASE_CLIENT_EMAIL"),
    privateKey: req("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    storageBucket: req("FIREBASE_STORAGE_BUCKET"),
  },
};
