/// <reference types="next" />

// Extend Next.js types with our environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
  }
}
