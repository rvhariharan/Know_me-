import { createClient } from "@supabase/supabase-js";
import {
  Quiz,
  Question,
  QuizAttempt,
  AttemptAnswer,
  LeaderboardEntry,
  QuizStats,
} from "@/types/quiz";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseKey.includes("placeholder")
);

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const supabaseStore = {
  async createQuiz(
    quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">,
    questionsData: Omit<Question, "id" | "quizId">[]
  ): Promise<{ quiz: Quiz; questions: Question[] }> {
    if (!supabaseClient) throw new Error("Supabase is not configured.");

    const { data: quizResult, error: quizError } = await supabaseClient
      .from("quizzes")
      .insert({
        creator_id: quizData.creatorId || null,
        creator_name: quizData.creatorName,
        creator_token: quizData.creatorToken,
        title: quizData.title,
        description: quizData.description || null,
        share_code: quizData.shareCode,
        is_public: quizData.isPublic,
        show_leaderboard: quizData.showLeaderboard,
      })
      .select()
      .single();

    if (quizError || !quizResult) {
      throw new Error(`Failed to create quiz: ${quizError?.message}`);
    }

    const quizId = quizResult.id;
    const questionsToInsert = questionsData.map((q, idx) => ({
      quiz_id: quizId,
      question_text: q.questionText,
      option_1: q.option1,
      option_2: q.option2,
      option_3: q.option3,
      option_4: q.option4,
      correct_option: q.correctOption,
      question_order: idx,
    }));

    const { data: questionsResult, error: questionsError } = await supabaseClient
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (questionsError || !questionsResult) {
      throw new Error(`Failed to create questions: ${questionsError?.message}`);
    }

    const createdQuiz: Quiz = {
      id: quizResult.id,
      creatorId: quizResult.creator_id,
      creatorName: quizResult.creator_name,
      creatorToken: quizResult.creator_token,
      title: quizResult.title,
      description: quizResult.description,
      shareCode: quizResult.share_code,
      isPublic: quizResult.is_public,
      showLeaderboard: quizResult.show_leaderboard,
      createdAt: quizResult.created_at,
      updatedAt: quizResult.updated_at,
    };

    const createdQuestions: Question[] = questionsResult.map((q: any) => ({
      id: q.id,
      quizId: q.quiz_id,
      questionText: q.question_text,
      option1: q.option_1,
      option2: q.option_2,
      option3: q.option_3,
      option4: q.option_4,
      correctOption: q.correct_option,
      questionOrder: q.question_order,
    }));

    return { quiz: createdQuiz, questions: createdQuestions };
  },

  async getQuizByCode(
    shareCode: string,
    includeAnswers: boolean = false
  ): Promise<(Quiz & { questions: Question[] }) | null> {
    if (!supabaseClient) return null;

    const { data: quizResult, error: quizError } = await supabaseClient
      .from("quizzes")
      .select("*")
      .ilike("share_code", shareCode)
      .single();

    if (quizError || !quizResult) return null;

    const { data: questionsResult, error: questionsError } = await supabaseClient
      .from("questions")
      .select("*")
      .eq("quiz_id", quizResult.id)
      .order("question_order", { ascending: true });

    if (questionsError || !questionsResult) return null;

    const questions: Question[] = questionsResult.map((q: any) => ({
      id: q.id,
      quizId: q.quiz_id,
      questionText: q.question_text,
      option1: q.option_1,
      option2: q.option_2,
      option3: q.option_3,
      option4: q.option_4,
      correctOption: includeAnswers ? q.correct_option : (1 as const),
      questionOrder: q.question_order,
    }));

    return {
      id: quizResult.id,
      creatorId: quizResult.creator_id,
      creatorName: quizResult.creator_name,
      creatorToken: quizResult.creator_token,
      title: quizResult.title,
      description: quizResult.description,
      shareCode: quizResult.share_code,
      isPublic: quizResult.is_public,
      showLeaderboard: quizResult.show_leaderboard,
      createdAt: quizResult.created_at,
      updatedAt: quizResult.updated_at,
      questions,
    };
  },

  async getQuizById(
    quizId: string,
    includeAnswers: boolean = false
  ): Promise<(Quiz & { questions: Question[] }) | null> {
    if (!supabaseClient) return null;

    const { data: quizResult, error: quizError } = await supabaseClient
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (quizError || !quizResult) return null;

    const { data: questionsResult, error: questionsError } = await supabaseClient
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("question_order", { ascending: true });

    if (questionsError || !questionsResult) return null;

    const questions: Question[] = questionsResult.map((q: any) => ({
      id: q.id,
      quizId: q.quiz_id,
      questionText: q.question_text,
      option1: q.option_1,
      option2: q.option_2,
      option3: q.option_3,
      option4: q.option_4,
      correctOption: includeAnswers ? q.correct_option : (1 as const),
      questionOrder: q.question_order,
    }));

    return {
      id: quizResult.id,
      creatorId: quizResult.creator_id,
      creatorName: quizResult.creator_name,
      creatorToken: quizResult.creator_token,
      title: quizResult.title,
      description: quizResult.description,
      shareCode: quizResult.share_code,
      isPublic: quizResult.is_public,
      showLeaderboard: quizResult.show_leaderboard,
      createdAt: quizResult.created_at,
      updatedAt: quizResult.updated_at,
      questions,
    };
  },

  async getQuizzesByCreatorToken(creatorToken: string): Promise<Quiz[]> {
    if (!supabaseClient) return [];

    const { data, error } = await supabaseClient
      .from("quizzes")
      .select("*")
      .eq("creator_token", creatorToken)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((q: any) => ({
      id: q.id,
      creatorId: q.creator_id,
      creatorName: q.creator_name,
      creatorToken: q.creator_token,
      title: q.title,
      description: q.description,
      shareCode: q.share_code,
      isPublic: q.is_public,
      showLeaderboard: q.show_leaderboard,
      createdAt: q.created_at,
      updatedAt: q.updated_at,
    }));
  },

  async saveAttempt(
    attemptData: Omit<QuizAttempt, "id" | "createdAt">,
    answersData: Omit<AttemptAnswer, "id" | "attemptId">[]
  ): Promise<{ attempt: QuizAttempt; answers: AttemptAnswer[] }> {
    if (!supabaseClient) throw new Error("Supabase is not configured.");

    const { data: attemptResult, error: attemptError } = await supabaseClient
      .from("attempts")
      .insert({
        quiz_id: attemptData.quizId,
        player_name: attemptData.playerName,
        score: attemptData.score,
        total_questions: attemptData.totalQuestions,
        percentage: attemptData.percentage,
      })
      .select()
      .single();

    if (attemptError || !attemptResult) {
      throw new Error(`Failed to save attempt: ${attemptError?.message}`);
    }

    const attemptId = attemptResult.id;
    const answersToInsert = answersData.map((ans) => ({
      attempt_id: attemptId,
      question_id: ans.questionId,
      selected_option: ans.selectedOption,
      is_correct: ans.isCorrect,
    }));

    const { data: answersResult, error: answersError } = await supabaseClient
      .from("answers")
      .insert(answersToInsert)
      .select();

    if (answersError || !answersResult) {
      throw new Error(`Failed to save answers: ${answersError?.message}`);
    }

    return {
      attempt: {
        id: attemptResult.id,
        quizId: attemptResult.quiz_id,
        playerName: attemptResult.player_name,
        score: attemptResult.score,
        totalQuestions: attemptResult.total_questions,
        percentage: Number(attemptResult.percentage),
        createdAt: attemptResult.created_at,
      },
      answers: answersResult.map((a: any) => ({
        id: a.id,
        attemptId: a.attempt_id,
        questionId: a.question_id,
        selectedOption: a.selected_option,
        isCorrect: a.is_correct,
      })),
    };
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
    if (!supabaseClient) return null;

    const { data: attemptResult, error: attemptError } = await supabaseClient
      .from("attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attemptResult) return null;

    const { data: quizResult, error: quizError } = await supabaseClient
      .from("quizzes")
      .select("*")
      .eq("id", attemptResult.quiz_id)
      .single();

    if (quizError || !quizResult) return null;

    const { data: answersResult } = await supabaseClient
      .from("answers")
      .select("*")
      .eq("attempt_id", attemptId);

    const { data: questionsResult } = await supabaseClient
      .from("questions")
      .select("*")
      .eq("quiz_id", quizResult.id);

    const questionsMap = new Map((questionsResult || []).map((q: any) => [q.id, q]));

    const detailedAnswers = (answersResult || []).map((ans: any) => {
      const q = questionsMap.get(ans.question_id);
      return {
        id: ans.id,
        attemptId: ans.attempt_id,
        questionId: ans.question_id,
        selectedOption: ans.selected_option,
        isCorrect: ans.is_correct,
        questionText: q?.question_text || "Question",
        options: [
          q?.option_1 || "",
          q?.option_2 || "",
          q?.option_3 || "",
          q?.option_4 || "",
        ] as [string, string, string, string],
        correctOption: (q?.correct_option || 1) as 1 | 2 | 3 | 4,
      };
    });

    return {
      attempt: {
        id: attemptResult.id,
        quizId: attemptResult.quiz_id,
        playerName: attemptResult.player_name,
        score: attemptResult.score,
        totalQuestions: attemptResult.total_questions,
        percentage: Number(attemptResult.percentage),
        createdAt: attemptResult.created_at,
      },
      quiz: {
        id: quizResult.id,
        creatorId: quizResult.creator_id,
        creatorName: quizResult.creator_name,
        creatorToken: quizResult.creator_token,
        title: quizResult.title,
        description: quizResult.description,
        shareCode: quizResult.share_code,
        isPublic: quizResult.is_public,
        showLeaderboard: quizResult.show_leaderboard,
        createdAt: quizResult.created_at,
        updatedAt: quizResult.updated_at,
      },
      answers: detailedAnswers,
    };
  },

  async getLeaderboard(
    shareCode: string,
    limit: number = 20
  ): Promise<LeaderboardEntry[]> {
    if (!supabaseClient) return [];

    const { data: quizResult } = await supabaseClient
      .from("quizzes")
      .select("id")
      .ilike("share_code", shareCode)
      .single();

    if (!quizResult) return [];

    const { data: attempts, error } = await supabaseClient
      .from("attempts")
      .select("*")
      .eq("quiz_id", quizResult.id)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error || !attempts) return [];

    return attempts.map((a: any, idx: number) => ({
      id: a.id,
      playerName: a.player_name,
      score: a.score,
      totalQuestions: a.total_questions,
      percentage: Number(a.percentage),
      createdAt: a.created_at,
      rank: idx + 1,
    }));
  },

  async getQuizStats(
    shareCode: string,
    creatorToken: string
  ): Promise<QuizStats | null> {
    if (!supabaseClient) return null;

    const { data: quizResult } = await supabaseClient
      .from("quizzes")
      .select("*")
      .ilike("share_code", shareCode)
      .eq("creator_token", creatorToken)
      .single();

    if (!quizResult) return null;

    const { data: attempts } = await supabaseClient
      .from("attempts")
      .select("*")
      .eq("quiz_id", quizResult.id)
      .order("created_at", { ascending: false });

    const attemptsList = attempts || [];
    const count = attemptsList.length;
    let avg = 0;
    let highest = 0;
    let lowest = 0;

    if (count > 0) {
      const sum = attemptsList.reduce((acc: number, curr: any) => acc + curr.score, 0);
      avg = Math.round((sum / count) * 10) / 10;
      highest = Math.max(...attemptsList.map((a: any) => a.score));
      lowest = Math.min(...attemptsList.map((a: any) => a.score));
    }

    return {
      quiz: {
        id: quizResult.id,
        creatorId: quizResult.creator_id,
        creatorName: quizResult.creator_name,
        creatorToken: quizResult.creator_token,
        title: quizResult.title,
        description: quizResult.description,
        shareCode: quizResult.share_code,
        isPublic: quizResult.is_public,
        showLeaderboard: quizResult.show_leaderboard,
        createdAt: quizResult.created_at,
        updatedAt: quizResult.updated_at,
      },
      attemptsCount: count,
      averageScore: avg,
      highestScore: highest,
      lowestScore: lowest,
      recentAttempts: attemptsList.map((a: any) => ({
        id: a.id,
        quizId: a.quiz_id,
        playerName: a.player_name,
        score: a.score,
        totalQuestions: a.total_questions,
        percentage: Number(a.percentage),
        createdAt: a.created_at,
      })),
    };
  },

  async deleteQuiz(shareCode: string, creatorToken: string): Promise<boolean> {
    if (!supabaseClient) return false;

    const { error } = await supabaseClient
      .from("quizzes")
      .delete()
      .ilike("share_code", shareCode)
      .eq("creator_token", creatorToken);

    return !error;
  },
};
