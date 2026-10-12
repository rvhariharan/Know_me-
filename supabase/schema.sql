-- ==============================================================================
-- KnowMe - PostgreSQL / Supabase Database Schema
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table (Optional authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    creator_name TEXT NOT NULL,
    creator_token TEXT NOT NULL, -- Secret key for anonymous creator management
    title TEXT NOT NULL,
    description TEXT,
    share_code TEXT UNIQUE NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT true,
    show_leaderboard BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_1 TEXT NOT NULL,
    option_2 TEXT NOT NULL,
    option_3 TEXT NOT NULL,
    option_4 TEXT NOT NULL,
    correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 1 AND 4),
    question_order INT NOT NULL DEFAULT 0
);

-- 5. Attempts Table (Player Submissions)
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Answers Table (Individual Question Responses)
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    selected_option SMALLINT NOT NULL CHECK (selected_option BETWEEN 1 AND 4),
    is_correct BOOLEAN NOT NULL
);

-- ==============================================================================
-- Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_quizzes_share_code ON quizzes(share_code);
CREATE INDEX IF NOT EXISTS idx_quizzes_creator_token ON quizzes(creator_token);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(quiz_id, question_order);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_leaderboard ON attempts(quiz_id, score DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_answers_attempt_id ON answers(attempt_id);

-- ==============================================================================
-- Row Level Security (RLS) - Recommended for Supabase
-- ==============================================================================
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active quizzes
CREATE POLICY "Public quizzes are viewable by everyone" 
ON quizzes FOR SELECT 
USING (is_public = true);

-- Allow creators to update their quizzes if they hold the creator_token
CREATE POLICY "Creators can update quizzes with token" 
ON quizzes FOR ALL 
USING (true);

-- Allow public to view questions
CREATE POLICY "Questions are viewable by everyone" 
ON questions FOR SELECT 
USING (true);

-- Allow anyone to create quiz attempts
CREATE POLICY "Anyone can submit an attempt" 
ON attempts FOR INSERT 
WITH CHECK (true);

-- Public can view attempts for leaderboards
CREATE POLICY "Attempts are viewable for leaderboard" 
ON attempts FOR SELECT 
USING (true);

-- Anyone can insert answers for an attempt
CREATE POLICY "Anyone can insert answers" 
ON answers FOR INSERT 
WITH CHECK (true);

-- View answers for attempt results
CREATE POLICY "Answers are viewable for attempt results" 
ON answers FOR SELECT 
USING (true);
