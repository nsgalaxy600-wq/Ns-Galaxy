export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface TestConfig {
  institute: string;
  testType: 'Weekly Test' | 'Monthly Test' | 'Semester Exam' | string;
  course: string;
  subject: string;
  topic: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarking: number;
  difficulty: string;
  language: 'Hindi' | 'English' | 'Bilingual (Hindi + English)';
  model: string;
  timeLimitMinutes: number;
}

export interface StudentInfo {
  fullName: string;
  rollNumber: string;
  course: string;
  batchTime: string;
  email?: string;
}

export interface TestSubmission {
  id: string;
  testTitle: string;
  course: string;
  subject: string;
  testType: string;
  student: StudentInfo;
  answers: Record<number, string>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
  questions: Question[];
}
