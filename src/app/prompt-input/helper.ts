export type AI = 'GEMINI' | 'OPENAI' | 'DEEPSEEK';

export enum AI_NAME {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  DEEPSEEK = 'DEEPSEEK',
}

export interface Answer {
  prompt: string
  answer: string
  ai: AI
  aiName: AI_NAME
  timestamp: number
}


export interface Model {
  value: string;
  viewValue: string;
}
export interface AiProvider {
  name: string;
  id: string;
}


export interface ModelGroup {
  disabled?: boolean;
  name: string;
  model: Model[];
}
