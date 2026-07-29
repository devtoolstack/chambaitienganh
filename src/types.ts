export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
}

export interface ClassRoom {
  id: string;
  subjectId: string;
  subjectName?: string;
  name: string;
  code: string;
  token: string;
  studentCount: number;
  createdAt: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  maxScore: number;
  weight: number;
  description: string;
}

export interface Rubric {
  id: string;
  title: string;
  description: string;
  criteria: RubricCriterion[];
  isDefault?: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  classRoomId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  rubricId: string;
  rubricTitle?: string;
  title: string;
  instructions: string;
  maxScore: number;
  deadline: string;
  publicToken: string;
  status: 'active' | 'closed';
  submissionCount?: number;
  createdAt: string;
}

export interface GrammarError {
  original: string;
  correction: string;
  explanation: string;
}

export interface VocabularyError {
  original: string;
  correction: string;
  explanation: string;
}

export interface CriterionScore {
  criterionId?: string;
  criterionTitle: string;
  score: number;
  maxScore?: number;
  comment: string;
}

export interface AiResult {
  id: string;
  submissionId: string;
  totalScore: number;
  criteriaScores: CriterionScore[];
  grammarErrors: GrammarError[];
  vocabularyErrors: VocabularyError[];
  scoreExplanation: string;
  overallFeedbackVi: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentName: string;
  studentCode: string;
  studentEmail: string;
  content: string;
  score: number | null;
  status: 'submitted' | 'grading' | 'graded' | 'error' | 'error_maintenance';
  submittedAt: string;
  aiResult?: AiResult | null;
}

export interface SimilarityPair {
  id: string;
  submission1: {
    id: string;
    studentName: string;
    studentCode: string;
  };
  submission2: {
    id: string;
    studentName: string;
    studentCode: string;
  };
  similarityPercentage: number;
  matchingExcerpts: {
    text1: string;
    text2: string;
    length: number;
  }[];
}

export interface PlagiarismCheckResult {
  assignmentId: string;
  assignmentTitle?: string;
  totalSubmissions: number;
  checkedPairsCount: number;
  flaggedPairsCount: number;
  averageSimilarity: number;
  pairs: SimilarityPair[];
  checkedAt: string;
}

export interface SystemSettings {
  aiModel: string;
  geminiApiKeyConfigured: boolean;
  plagiarismThreshold: number;
  promptTemplate: string;
}
