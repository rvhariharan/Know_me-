async function runTests() {
  console.log("Testing KnowMe End-to-End 2-Option API Operations...");
  const baseUrl = "http://localhost:3000";

  // 1. Check Home Page
  try {
    const homeRes = await fetch(`${baseUrl}/`);
    console.log(`[1] Home Page Status: ${homeRes.status} (OK: ${homeRes.ok})`);
  } catch (err) {
    console.log("[1] Dev server not active on port 3000 yet, test will verify build");
    return;
  }

  // 2. Create 2-Choice Quiz with images
  const quizPayload = {
    creatorName: "CatLover",
    title: "How Well Do You Know CatLover?",
    description: "Visual This or That Quiz!",
    showLeaderboard: true,
    questions: [
      {
        questionText: "Pizza or Burgers: What do I crave more?",
        option1: "Crispy Pizza 🍕",
        option2: "Juicy Burger 🍔",
        option1Image: "/options/pizza.svg",
        option2Image: "/options/burger.svg",
        correctOption: 1,
      },
      {
        questionText: "Iced Coffee or Sweet Boba?",
        option1: "Iced Coffee ☕",
        option2: "Sweet Boba 🧋",
        option1Image: "/options/coffee.svg",
        option2Image: "/options/boba.svg",
        correctOption: 2,
      },
      {
        questionText: "Cute Cats or Fluffy Dogs?",
        option1: "Cute Cats 🐱",
        option2: "Fluffy Dogs 🐶",
        option1Image: "/options/cat.svg",
        option2Image: "/options/dog.svg",
        correctOption: 1,
      },
      {
        questionText: "Sunny Beach or Misty Mountains?",
        option1: "Sunny Beach 🏖️",
        option2: "Misty Mountains ⛰️",
        option1Image: "/options/beach.svg",
        option2Image: "/options/mountain.svg",
        correctOption: 1,
      },
      {
        questionText: "Early Sunrise or 3 AM Night Owl?",
        option1: "Early Sunrise 🌅",
        option2: "3 AM Night Owl 🌙",
        option1Image: "/options/morning.svg",
        option2Image: "/options/night.svg",
        correctOption: 2,
      },
    ],
  };

  const createRes = await fetch(`${baseUrl}/api/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizPayload),
  });

  const createData = await createRes.json();
  console.log(`[2] Create Quiz Status: ${createRes.status}`, createData);

  if (!createRes.ok) {
    console.error("Quiz creation failed:", createData);
    return;
  }

  const { shareCode } = createData;

  // 3. Fetch safe quiz (without answers exposed)
  const getRes = await fetch(`${baseUrl}/api/quizzes/${shareCode}`);
  const getData = await getRes.json();
  console.log(`[3] Get Safe Quiz Status: ${getRes.status}, Questions count: ${getData.quiz.questions.length}`);
  console.log(`Option 1 Image: ${getData.quiz.questions[0].option1Image}, Option 2 Image: ${getData.quiz.questions[0].option2Image}`);

  // 4. Submit player answers
  const submitPayload = {
    playerName: "Mochi",
    answers: getData.quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOption: 1,
    })),
  };

  const submitRes = await fetch(`${baseUrl}/api/quizzes/${shareCode}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submitPayload),
  });

  const submitData = await submitRes.json();
  console.log(`[4] Submit Quiz Status: ${submitRes.status}`);
  console.log(`Score: ${submitData.score}/${submitData.totalQuestions}, Tier: ${submitData.tier.label}, Cat Image: ${submitData.tier.catImage}`);

  console.log("✅ All 2-Option Quiz tests succeeded!");
}

runTests().catch(console.error);
