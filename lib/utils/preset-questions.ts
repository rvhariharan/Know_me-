export interface QuestionTemplate {
  category: string;
  questionText: string;
  options: [string, string];
  optionImages: [string, string];
  defaultCorrectOption: 1 | 2;
}

export const PRESET_CATEGORIES = [
  "Food & Cravings 🍕",
  "Vibes & Lifestyle ☕",
  "Love & Pets 🐱",
  "Habits & Quirks 🌙",
  "Fun & Hangouts 🎮",
];

export const PRESET_QUESTIONS: QuestionTemplate[] = [
  // Food & Cravings
  {
    category: "Food & Cravings 🍕",
    questionText: "Pizza or Burgers: What do I crave more?",
    options: ["Crispy Pizza 🍕", "Juicy Burger 🍔"],
    optionImages: ["/options/pizza.svg", "/options/burger.svg"],
    defaultCorrectOption: 1,
  },
  {
    category: "Food & Cravings 🍕",
    questionText: "Sweet desserts or spicy street food?",
    options: ["Sweet Desserts 🍰", "Spicy Street Food 🌶️"],
    optionImages: ["/options/sweet.svg", "/options/spicy.svg"],
    defaultCorrectOption: 2,
  },
  {
    category: "Food & Cravings 🍕",
    questionText: "Cooking together at home or late takeout?",
    options: ["Home Cooked Meal 🍳", "Late Night Takeout 🥡"],
    optionImages: ["/options/cooking.svg", "/options/takeout.svg"],
    defaultCorrectOption: 2,
  },

  // Vibes & Lifestyle
  {
    category: "Vibes & Lifestyle ☕",
    questionText: "Iced Coffee or Sweet Boba Tea?",
    options: ["Iced Coffee ☕", "Sweet Boba 🧋"],
    optionImages: ["/options/coffee.svg", "/options/boba.svg"],
    defaultCorrectOption: 1,
  },
  {
    category: "Vibes & Lifestyle ☕",
    questionText: "Sunny Beach trip or Misty Mountains?",
    options: ["Sunny Beach 🏖️", "Misty Mountains ⛰️"],
    optionImages: ["/options/beach.svg", "/options/mountain.svg"],
    defaultCorrectOption: 1,
  },
  {
    category: "Vibes & Lifestyle ☕",
    questionText: "Cozy stay-in or wild party night?",
    options: ["Cozy Stay-In 🛋️", "Night Out / Party 🪩"],
    optionImages: ["/options/home.svg", "/options/party.svg"],
    defaultCorrectOption: 1,
  },

  // Love & Pets
  {
    category: "Love & Pets 🐱",
    questionText: "Cute Cats or Fluffy Dogs?",
    options: ["Cute Kittens 🐱", "Fluffy Puppies 🐶"],
    optionImages: ["/options/cat.svg", "/options/dog.svg"],
    defaultCorrectOption: 1,
  },
  {
    category: "Love & Pets 🐱",
    questionText: "Warm cozy cuddles or spontaneous road trip?",
    options: ["Warm Cuddles 🧸", "Road Trip Adventure 🚗"],
    optionImages: ["/options/cuddle.svg", "/options/roadtrip.svg"],
    defaultCorrectOption: 1,
  },

  // Habits & Quirks
  {
    category: "Habits & Quirks 🌙",
    questionText: "Early Morning Sunrise or 3 AM Night Owl?",
    options: ["Early Sunrise 🌅", "3 AM Night Owl 🌙"],
    optionImages: ["/options/morning.svg", "/options/night.svg"],
    defaultCorrectOption: 2,
  },
  {
    category: "Habits & Quirks 🌙",
    questionText: "Gaming marathon or binge-watching shows?",
    options: ["Video Games 🎮", "Binge-Watching Shows 🍿"],
    optionImages: ["/options/gaming.svg", "/options/movies.svg"],
    defaultCorrectOption: 2,
  },

  // Fun & Hangouts
  {
    category: "Fun & Hangouts 🎮",
    questionText: "Phone call or endless texting with memes?",
    options: ["Long Late-Night Calls 📞", "Texting Memes All Day 💬"],
    optionImages: ["/options/home.svg", "/options/party.svg"],
    defaultCorrectOption: 2,
  },
  {
    category: "Fun & Hangouts 🎮",
    questionText: "Spontaneous surprise or planned itinerary?",
    options: ["100% Spontaneous ⚡", "Carefully Planned Out 📋"],
    optionImages: ["/options/beach.svg", "/options/mountain.svg"],
    defaultCorrectOption: 1,
  },
];

export const DEFAULT_INITIAL_QUESTIONS: QuestionTemplate[] = PRESET_QUESTIONS.slice(0, 10);
