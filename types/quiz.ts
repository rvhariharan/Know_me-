export interface Question {
  id: string;
  quizId?: string;
  questionText: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  option1Image?: string;
  option2Image?: string;
  correctOption: 1 | 2 | 3 | 4;
  questionOrder: number;
}

export interface Quiz {
  id: string;
  creatorId?: string;
  creatorName: string;
  creatorToken: string; // Secret key for the creator to manage/edit/view stats
  title: string;
  description?: string;
  shareCode: string;
  isPublic: boolean;
  showLeaderboard: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOption: 1 | 2 | 3 | 4;
  isCorrect: boolean;
}

export interface ScoreTier {
  minScore: number;
  maxScore: number;
  label: string;
  emoji: string;
  catImage: string;
  quote: string;
  badgeColor: string;
  gradient: string;
}

export interface QuizSubmissionPayload {
  playerName: string;
  answers: {
    questionId: string;
    selectedOption: 1 | 2 | 3 | 4;
  }[];
}

export interface SubmissionResult {
  attemptId: string;
  quizId: string;
  shareCode: string;
  creatorName: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  tier: ScoreTier;
  createdAt: string;
  breakdown: {
    questionId: string;
    questionText: string;
    options: [string, string, string?, string?];
    optionImages?: [string?, string?];
    selectedOption: 1 | 2 | 3 | 4;
    correctOption: 1 | 2 | 3 | 4;
    isCorrect: boolean;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
  rank: number;
}

export interface QuizStats {
  quiz: Quiz;
  attemptsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  recentAttempts: QuizAttempt[];
}
