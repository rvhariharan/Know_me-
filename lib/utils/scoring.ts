import { ScoreTier } from "@/types/quiz";

export function getScoreTier(score: number, totalQuestions: number): ScoreTier {
  // Normalize to a 10-point scale for tier determination
  const normalizedScore = totalQuestions > 0 ? (score / totalQuestions) * 10 : 0;
  const rounded = Math.round(normalizedScore);

  if (rounded <= 2) {
    return {
      minScore: 0,
      maxScore: 2,
      label: "Strangers At Best",
      emoji: "😿",
      catImage: "/cats/cat-sad.jpg",
      quote: "Bro... do you even know me? 💀",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
      gradient: "from-rose-600/30 via-red-900/30 to-black",
    };
  }

  if (rounded <= 4) {
    return {
      minScore: 3,
      maxScore: 4,
      label: "Fake Friend Detected",
      emoji: "😹",
      catImage: "/cats/cat-confused.jpg",
      quote: "Fake Friend Detected 😂",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      gradient: "from-orange-600/30 via-amber-900/30 to-black",
    };
  }

  if (rounded <= 6) {
    return {
      minScore: 5,
      maxScore: 6,
      label: "Acquaintance Level",
      emoji: "😺",
      catImage: "/cats/cat-cool.jpg",
      quote: "Okay, you know me a little 😅",
      badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      gradient: "from-yellow-600/30 via-stone-900/30 to-black",
    };
  }

  if (rounded <= 8) {
    return {
      minScore: 7,
      maxScore: 8,
      label: "Good Friend",
      emoji: "😻",
      catImage: "/cats/love_cats_couple.jpg",
      quote: "Good Friend 🥰 We got a real bond!",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      gradient: "from-emerald-600/30 via-teal-900/30 to-black",
    };
  }

  if (rounded === 9) {
    return {
      minScore: 9,
      maxScore: 9,
      label: "Close Friend",
      emoji: "💖",
      catImage: "/cats/couple_cats.gif",
      quote: "Close Friend ❤️ You truly get me!",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      gradient: "from-pink-600/30 via-purple-900/30 to-black",
    };
  }

  return {
    minScore: 10,
    maxScore: 10,
    label: "BEST FRIEND / SOULMATE!",
    emoji: "👑",
    catImage: "/cats/cat-crown.jpg",
    quote: "BEST FRIEND! 👑 You know me better than I know myself!",
    badgeColor: "bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-amber-500/20 shadow-lg",
    gradient: "from-amber-500/40 via-purple-900/40 to-black",
  };
}

export const ALL_TIERS: ScoreTier[] = [
  {
    minScore: 0,
    maxScore: 2,
    label: "Strangers",
    emoji: "😿",
    catImage: "/cats/cat-sad.jpg",
    quote: "Bro... do you even know me? 💀",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    gradient: "from-rose-600/30 to-red-950",
  },
  {
    minScore: 3,
    maxScore: 4,
    label: "Fake Friend",
    emoji: "😹",
    catImage: "/cats/cat-confused.jpg",
    quote: "Fake Friend Detected 😂",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-orange-600/30 to-amber-950",
  },
  {
    minScore: 5,
    maxScore: 6,
    label: "Acquaintance",
    emoji: "😺",
    catImage: "/cats/cat-cool.jpg",
    quote: "Okay, you know me a little 😅",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    gradient: "from-yellow-600/30 to-stone-950",
  },
  {
    minScore: 7,
    maxScore: 8,
    label: "Good Friend",
    emoji: "😻",
    catImage: "/cats/love_cats_couple.jpg",
    quote: "Good Friend 🥰 Real bond!",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    gradient: "from-emerald-600/30 to-teal-950",
  },
  {
    minScore: 9,
    maxScore: 9,
    label: "Close Friend",
    emoji: "💖",
    catImage: "/cats/love_cats_cuddle.jpg",
    quote: "Close Friend ❤️ Super close!",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    gradient: "from-pink-600/30 to-purple-950",
  },
  {
    minScore: 10,
    maxScore: 10,
    label: "Best Friend",
    emoji: "👑",
    catImage: "/cats/cat-crown.jpg",
    quote: "BEST FRIEND! 👑 Legendary Soulmate!",
    badgeColor: "bg-amber-400/25 text-amber-300 border-amber-400/50",
    gradient: "from-amber-500/40 to-purple-950",
  },
];
