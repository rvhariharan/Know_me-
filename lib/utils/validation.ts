export function sanitizeText(text: unknown): string {
  if (typeof text !== "string") return "";
  return text
    .replace(/[<>]/g, "") // basic sanitization against tags
    .trim();
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateQuizInput(data: {
  creatorName: unknown;
  title: unknown;
  description?: unknown;
  questions: unknown;
}): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const creatorName = sanitizeText(data.creatorName);
  if (!creatorName || creatorName.length < 2) {
    errors.push({
      field: "creatorName",
      message: "Creator name must be at least 2 characters long.",
    });
  } else if (creatorName.length > 50) {
    errors.push({
      field: "creatorName",
      message: "Creator name cannot exceed 50 characters.",
    });
  }

  const title = sanitizeText(data.title);
  if (!title || title.length < 3) {
    errors.push({
      field: "title",
      message: "Quiz title must be at least 3 characters long.",
    });
  } else if (title.length > 100) {
    errors.push({
      field: "title",
      message: "Quiz title cannot exceed 100 characters.",
    });
  }

  if (!Array.isArray(data.questions)) {
    errors.push({
      field: "questions",
      message: "Questions must be an array.",
    });
    return { isValid: false, errors };
  }

  if (data.questions.length < 5) {
    errors.push({
      field: "questions",
      message: "A quiz must have at least 5 questions.",
    });
  } else if (data.questions.length > 20) {
    errors.push({
      field: "questions",
      message: "A quiz cannot have more than 20 questions in the free tier.",
    });
  }

  data.questions.forEach((q, index) => {
    const qNum = index + 1;
    if (!q || typeof q !== "object") {
      errors.push({ field: `question_${qNum}`, message: `Question ${qNum} is invalid.` });
      return;
    }

    const qText = sanitizeText((q as { questionText?: unknown }).questionText);
    if (!qText || qText.length < 3) {
      errors.push({
        field: `question_${qNum}_text`,
        message: `Question ${qNum} text is required (minimum 3 characters).`,
      });
    }

    const opt1 = sanitizeText((q as { option1?: unknown }).option1);
    const opt2 = sanitizeText((q as { option2?: unknown }).option2);

    if (!opt1) errors.push({ field: `question_${qNum}_opt1`, message: `Question ${qNum} Option 1 cannot be empty.` });
    if (!opt2) errors.push({ field: `question_${qNum}_opt2`, message: `Question ${qNum} Option 2 cannot be empty.` });

    const correct = (q as { correctOption?: unknown }).correctOption;
    if (![1, 2, 3, 4].includes(Number(correct))) {
      errors.push({
        field: `question_${qNum}_correct`,
        message: `Question ${qNum} must have a selected correct answer (1 or 2).`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateSubmissionInput(data: {
  playerName: unknown;
  answers: unknown;
  expectedQuestionsCount: number;
}): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  const playerName = sanitizeText(data.playerName);
  if (!playerName || playerName.length < 1) {
    errors.push({
      field: "playerName",
      message: "Please enter your name to submit.",
    });
  } else if (playerName.length > 50) {
    errors.push({
      field: "playerName",
      message: "Player name cannot exceed 50 characters.",
    });
  }

  if (!Array.isArray(data.answers)) {
    errors.push({
      field: "answers",
      message: "Answers array is missing or invalid.",
    });
    return { isValid: false, errors };
  }

  if (data.answers.length === 0) {
    errors.push({
      field: "answers",
      message: "You must answer at least one question.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// In-memory basic rate limiter (sliding window IP / token check)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number = 30, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}
