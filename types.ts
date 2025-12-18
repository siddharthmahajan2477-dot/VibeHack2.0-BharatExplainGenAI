export enum TopicCategory {
  EXAMS = 'Exams',
  LAWS = 'Laws',
  POLICIES = 'Policies',
  TECH = 'Tech',
  TOURISM = 'Tourism',
  CHATBOT = 'Chatbot'
}

export enum DifficultyLevel {
  SIMPLE = 'Simple',
  STUDENT = 'Student',
  ADVANCED = 'Advanced'
}

export interface ExplanationRequest {
  topic: string;
  category: TopicCategory;
  difficulty: DifficultyLevel;
  location?: { lat: number; lng: number };
}

export interface ExplanationResponse {
  content: string;
  timestamp: Date;
}

export interface HistoryItem extends ExplanationRequest, ExplanationResponse {
  id: string;
}

export interface DoubtItem {
  question: string;
  answer: string;
}

export type ThemeType = 'light' | 'dark' | 'sepia';

export type TranslationKey = 
  | 'welcome_title'
  | 'welcome_subtitle'
  | 'search_label'
  | 'search_placeholder'
  | 'category_label'
  | 'difficulty_label'
  | 'submit_button'
  | 'loading_text'
  | 'result_title'
  | 'translated_result_title'
  | 'disclaimer'
  | 'doubt_title'
  | 'doubt_placeholder'
  | 'doubt_button'
  | 'footer_made_with'
  | 'footer_data'
  | 'theme_label'
  | 'language_label'
  | 'settings_title';
