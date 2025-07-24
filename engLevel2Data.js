const level2Sentences = [
  {
    fullSentence: "Brother eats breakfast every morning.",
    parts: [
      { text: "Brother", isAnswer: false },
      { text: "eats breakfast", isAnswer: true },
      { text: "every", isAnswer: false },
      { text: "morning", isAnswer: false }
    ],
    possibleAnswers: ["Brother", "eats breakfast", "every", "morning"],
    options: {
      "Brother": ["Brother", "Mom", "Dad", "Sister"],
      "eats breakfast": ["eats breakfast", "washes hands", "reads books", "plays toys"],
      "every": ["every", "weekly", "yearly", "monthly"],
      "morning": ["morning", "noon", "night", "afternoon"]
    }
  },
  {
    fullSentence: "The puppy loves chasing butterflies the most.",
    parts: [
      { text: "The puppy", isAnswer: false },
      { text: "loves", isAnswer: false },
      { text: "chasing butterflies", isAnswer: true },
      { text: "the most", isAnswer: false }
    ],
    possibleAnswers: ["The puppy", "loves", "chasing butterflies", "the most"],
    options: {
      "The puppy": ["The puppy", "The kitten", "The bird", "The fish"],
      "loves": ["loves", "hates", "fears", "wants"],
      "chasing butterflies": ["chasing butterflies", "watching TV", "eating apples", "writing"],
      "the most": ["the most", "very", "a lot", "not much"]
    }
  },
  {
    fullSentence: "Mom is cooking in the kitchen.",
    parts: [
      { text: "Mom", isAnswer: false },
      { text: "is", isAnswer: false },
      { text: "cooking", isAnswer: true },
      { text: "in the kitchen", isAnswer: false }
    ],
    possibleAnswers: ["Mom", "is", "cooking", "in the kitchen"],
    options: {
      "Mom": ["Mom", "Dad", "Brother", "Sister"],
      "is": ["is", "has", "will", "just"],
      "cooking": ["cooking", "singing", "dancing", "drawing"],
      "in the kitchen": ["in the kitchen", "in the living room", "in the bedroom", "in the garden"]
    }
  }
];