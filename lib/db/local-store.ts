import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  Quiz,
  Question,
  QuizAttempt,
  AttemptAnswer,
  LeaderboardEntry,
  QuizStats,
} from "@/types/quiz";

interface DatabaseFileContent {
  quizzes: Quiz[];
  questions: Question[];
  attempts: QuizAttempt[];
  answers: AttemptAnswer[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "knowme-db.json");

function ensureDbFile(): DatabaseFileContent {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseFileContent = {
        quizzes: [],
        questions: [],
        attempts: [],
        answers: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content) as DatabaseFileContent;
  } catch (err) {
    console.error("Local DB read error, resetting:", err);
    return { quizzes: [], questions: [], attempts: [], answers: [] };
  }
}

function writeDbFile(data: DatabaseFileContent) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Local DB write error:", err);
  }
}

export const localStore = {
  async createQuiz(
    quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">,
    questionsData: Omit<Question, "id" | "quizId">[]
  ): Promise<{ quiz: Quiz; questions: Question[] }> {
    const db = ensureDbFile();
    const quizId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newQuiz: Quiz = {
      ...quizData,
      id: quizId,
      createdAt: now,
      updatedAt: now,
    };

    const newQuestions: Question[] = questionsData.map((q, idx) => ({
      ...q,
      id: crypto.randomUUID(),
      quizId,
      questionOrder: idx,
    }));

    db.quizzes.push(newQuiz);
    db.questions.push(...newQuestions);
    writeDbFile(db);

    return { quiz: newQuiz, questions: newQuestions };
  },

  async getQuizByCode(
    shareCode: string,
    includeAnswers: boolean = false
  ): Promise<(Quiz & { questions: Question[] }) | null> {
    const db = ensureDbFile();
    const quiz = db.quizzes.find(
      (q) => q.shareCode.toLowerCase() === shareCode.toLowerCase()
    );
    if (!quiz) return null;

    const questions = db.questions
      .filter((q) => q.quizId === quiz.id)
      .sort((a, b) => a.questionOrder - b.questionOrder)
      .map((q) => {
        if (includeAnswers) return q;
        // Never expose correctOption to players beforehand!
        const { correctOption, ...safeQuestion } = q;
        return {
          ...safeQuestion,
          correctOption: 1 as const, // placeholder for typing
        };
      });

    return {
      ...quiz,
      questions,
    };
  },

  async getQuizById(
    quizId: string,
    includeAnswers: boolean = false
  ): Promise<(Quiz & { questions: Question[] }) | null> {
    const db = ensureDbFile();
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) return null;

    const questions = db.questions
      .filter((q) => q.quizId === quiz.id)
      .sort((a, b) => a.questionOrder - b.questionOrder)
      .map((q) => {
        if (includeAnswers) return q;
        const { correctOption, ...safeQuestion } = q;
        return {
          ...safeQuestion,
          correctOption: 1 as const,
        };
      });

    return {
      ...quiz,
      questions,
    };
  },

  async getQuizzesByCreatorToken(creatorToken: string): Promise<Quiz[]> {
    const db = ensureDbFile();
    return db.quizzes
      .filter((q) => q.creatorToken === creatorToken)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async saveAttempt(
    attemptData: Omit<QuizAttempt, "id" | "createdAt">,
    answersData: Omit<AttemptAnswer, "id" | "attemptId">[]
  ): Promise<{ attempt: QuizAttempt; answers: AttemptAnswer[] }> {
    const db = ensureDbFile();
    const attemptId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: attemptId,
      createdAt: now,
    };

    const newAnswers: AttemptAnswer[] = answersData.map((ans) => ({
      ...ans,
      id: crypto.randomUUID(),
      attemptId,
    }));

    db.attempts.push(newAttempt);
    db.answers.push(...newAnswers);
    writeDbFile(db);

    return { attempt: newAttempt, answers: newAnswers };
  },

  async getAttemptById(attemptId: string): Promise<{
    attempt: QuizAttempt;
    quiz: Quiz;
    answers: (AttemptAnswer & {
      questionText: string;
      options: [string, string, string, string];
      correctOption: 1 | 2 | 3 | 4;
    })[];
  } | null> {
    const db = ensureDbFile();
    const attempt = db.attempts.find((a) => a.id === attemptId);
    if (!attempt) return null;

    const quiz = db.quizzes.find((q) => q.id === attempt.quizId);
    if (!quiz) return null;

    const rawAnswers = db.answers.filter((a) => a.attemptId === attempt.id);
    const questions = db.questions.filter((q) => q.quizId === quiz.id);

    const detailedAnswers = rawAnswers.map((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      return {
        ...ans,
        questionText: q?.questionText || "Question",
        options: [
          q?.option1 || "",
          q?.option2 || "",
          q?.option3 || "",
          q?.option4 || "",
        ] as [string, string, string, string],
        correctOption: (q?.correctOption || 1) as 1 | 2 | 3 | 4,
      };
    });

    return {
      attempt,
      quiz,
      answers: detailedAnswers,
    };
  },

  async getLeaderboard(
    shareCode: string,
    limit: number = 20
  ): Promise<LeaderboardEntry[]> {
    const db = ensureDbFile();
    const quiz = db.quizzes.find(
      (q) => q.shareCode.toLowerCase() === shareCode.toLowerCase()
    );
    if (!quiz) return [];

    const attempts = db.attempts.filter((a) => a.quizId === quiz.id);

    // Sort by score descending, then by creation date ascending
    const sorted = attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });

    return sorted.slice(0, limit).map((a, idx) => ({
      id: a.id,
      playerName: a.playerName,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      createdAt: a.createdAt,
      rank: idx + 1,
    }));
  },

  async getQuizStats(
    shareCode: string,
    creatorToken: string
  ): Promise<QuizStats | null> {
    const db = ensureDbFile();
    const quiz = db.quizzes.find(
      (q) => q.shareCode.toLowerCase() === shareCode.toLowerCase()
    );
    if (!quiz || quiz.creatorToken !== creatorToken) return null;

    const attempts = db.attempts
      .filter((a) => a.quizId === quiz.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const attemptsCount = attempts.length;
    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = 0;

    if (attemptsCount > 0) {
      const sum = attempts.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = Math.round((sum / attemptsCount) * 10) / 10;
      highestScore = Math.max(...attempts.map((a) => a.score));
      lowestScore = Math.min(...attempts.map((a) => a.score));
    }

    return {
      quiz,
      attemptsCount,
      averageScore,
      highestScore,
      lowestScore,
      recentAttempts: attempts,
    };
  },

  async deleteQuiz(shareCode: string, creatorToken: string): Promise<boolean> {
    const db = ensureDbFile();
    const quizIndex = db.quizzes.findIndex(
      (q) =>
        q.shareCode.toLowerCase() === shareCode.toLowerCase() &&
        q.creatorToken === creatorToken
    );
    if (quizIndex === -1) return false;

    const quizId = db.quizzes[quizIndex].id;
    db.quizzes.splice(quizIndex, 1);
    db.questions = db.questions.filter((q) => q.quizId !== quizId);

    const attemptsToDelete = db.attempts
      .filter((a) => a.quizId === quizId)
      .map((a) => a.id);
    db.attempts = db.attempts.filter((a) => a.quizId !== quizId);
    db.answers = db.answers.filter((ans) => !attemptsToDelete.includes(ans.attemptId));

    writeDbFile(db);
    return true;
  },
};
