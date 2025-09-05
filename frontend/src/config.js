// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
};

// Environment
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Default settings
export const DEFAULT_SETTINGS = {
  temperature: 0.7,
  maxTokens: 1000,
  showTimestamps: true,
};

// Personas
export const PERSONAS = {
  assistant: {
    name: 'Assistant',
    description: 'Helpful and friendly AI assistant',
    prompt: 'You are a helpful AI assistant.',
  },
  tutor: {
    name: 'Tutor',
    description: 'Patient and educational',
    prompt: 'You are a knowledgeable tutor. Explain concepts clearly and provide examples.',
  },
  comedian: {
    name: 'Comedian',
    description: 'Witty and humorous',
    prompt: 'You are a comedian. Keep responses funny and lighthearted.',
  },
  writer: {
    name: 'Writer',
    description: 'Creative and eloquent',
    prompt: 'You are a creative writer. Provide detailed and engaging responses.',
  },
};

// Default persona
export const DEFAULT_PERSONA = 'assistant';
