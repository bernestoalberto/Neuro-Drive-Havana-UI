export type AI = 'GEMINI' | 'OPENAI'

export enum AI_NAME {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
}

export interface Answer {
  prompt: string
  answer: string
  ai: AI
  aiName: AI_NAME
  timestamp: number
}
