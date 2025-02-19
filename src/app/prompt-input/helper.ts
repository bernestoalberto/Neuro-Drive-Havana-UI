export type AI = 'Gemini' | 'Openai' | 'Deepseek';

export enum AI_NAME {
  GEMINI = 'Gemini',
  OPENAI = 'Openai',
  DEEPSEEK = 'Deepseek',
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
