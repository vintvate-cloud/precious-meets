import { QUIZ_QUESTIONS } from "./quiz-data";

export interface UserQuizAnswers {
  [questionId: string]: string | string[] | number | undefined;
}

export interface QuizAnswerRecord {
  questionNumber: number;
  questionTitle: string;
  category: string;
  answerLabel: string;
}

export interface SocialProfileScores {
  algorithmVersion: string;
  archetype: {
    title: string;
    description: string;
    keyTraits: string[];
    seatingSynergy: string;
    conversationalGift: string;
    idealAmbience: string;
    compatibilityRating: number;
  };
  dimensions: {
    socialEnergy: number; // 0 (reflective) - 100 (high-energy)
    conversationDepth: number; // 0 (playful/light) - 100 (existential/deep)
    playfulness: number; // 0 (serious/stoic) - 100 (banter/wit)
    curiosity: number; // 0 (focused/traditional) - 100 (omnivore/multidisciplinary)
    adventure: number; // 0 (structured/familiar) - 100 (spontaneous/bold)
    sharedInterests: string[];
    dietary: string;
    allergies: string[];
    boundaries: string[];
    preferredCity: string;
  };
  quizAnswers: QuizAnswerRecord[];
}

/**
 * Translates raw answer values into human-readable question & answer records for admin dossier review.
 */
export function generateQuizAnswerRecords(answers: UserQuizAnswers): QuizAnswerRecord[] {
  const records: QuizAnswerRecord[] = [];

  QUIZ_QUESTIONS.forEach((q) => {
    const rawVal = answers[q.id];
    if (rawVal === undefined || rawVal === null) return;

    let answerLabel = "";
    if (q.type === "slider" && typeof rawVal === "number") {
      if (q.id === "q3") {
        answerLabel = `${rawVal}% · ${
          rawVal >= 65
            ? "Lively & Buzzing Group Tempo"
            : rawVal <= 35
            ? "Intimate & Slow Conversational Pace"
            : "Harmonious Mid-Tempo Cadence"
        }`;
      } else if (q.id === "q5") {
        answerLabel = `${rawVal}% · ${
          rawVal <= 35
            ? "Zero tolerance (Dive directly into deep real topics)"
            : rawVal >= 65
            ? "Appreciates gentle warm-up & pleasantries first"
            : "Balanced conversational depth"
        }`;
      } else {
        answerLabel = `${rawVal}% Score`;
      }
    } else if (q.type === "multi_select" && Array.isArray(rawVal)) {
      const labels = rawVal.map((v) => {
        const opt = q.options.find((o) => o.value === v);
        return opt ? opt.label : String(v);
      });
      answerLabel = labels.join(", ") || "None declared";
    } else if (typeof rawVal === "string") {
      const opt = q.options.find((o) => o.value === rawVal);
      answerLabel = opt ? `${opt.label}${opt.sublabel ? ` (${opt.sublabel})` : ""}` : rawVal;
    }

    records.push({
      questionNumber: q.order,
      questionTitle: q.title,
      category: q.category,
      answerLabel,
    });
  });

  return records;
}

/**
 * Calculates a genuine, multi-dimensional psychometric profile (0-100) and classifies
 * the applicant into one of 8 distinct curated table archetypes.
 */
export function calculateSocialProfile(answers: UserQuizAnswers): SocialProfileScores {
  // 1. Social Energy (0-100)
  // q1 (Focus - 30% weight)
  let q1Score = 50;
  if (answers.q1 === "observer") q1Score = 20;
  else if (answers.q1 === "gentle") q1Score = 45;
  else if (answers.q1 === "contributor") q1Score = 75;
  else if (answers.q1 === "catalyst") q1Score = 96;

  // q2 (Recharge - 25% weight)
  let q2Score = 55;
  if (answers.q2 === "drained") q2Score = 22;
  else if (answers.q2 === "fulfilled_balanced") q2Score = 62;
  else if (answers.q2 === "energized") q2Score = 96;

  // q3 (Tempo slider - 30% weight)
  const q3Score = typeof answers.q3 === "number" ? answers.q3 : 50;

  // q9 (Group size - 15% weight)
  let q9Score = 60;
  if (answers.q9 === "4_people") q9Score = 35;
  else if (answers.q9 === "6_people") q9Score = 70;
  else if (answers.q9 === "8_people") q9Score = 95;

  let rawSocialEnergy = q1Score * 0.3 + q2Score * 0.25 + q3Score * 0.3 + q9Score * 0.15;

  // 2. Conversation Depth (0-100)
  // q4 (Topic direction - 50% weight)
  let q4Score = 60;
  if (answers.q4 === "travel_observations") q4Score = 42;
  else if (answers.q4 === "playful_banter") q4Score = 58;
  else if (answers.q4 === "turning_points") q4Score = 92;
  else if (answers.q4 === "philosophy") q4Score = 98;

  // q5 (Small talk tolerance slider - 50% weight)
  // Slider 0 = zero tolerance (depth = 96), Slider 100 = gentle pleasantries (depth = 36)
  const q5Val = typeof answers.q5 === "number" ? answers.q5 : 50;
  const q5Score = 100 - q5Val * 0.62; // Range: ~38 to 100

  let rawConversationDepth = q4Score * 0.5 + q5Score * 0.5;

  // 3. Playfulness & Wit (0-100)
  let q4Playfulness = 50;
  if (answers.q4 === "playful_banter") q4Playfulness = 95;
  else if (answers.q4 === "travel_observations") q4Playfulness = 72;
  else if (answers.q4 === "turning_points") q4Playfulness = 52;
  else if (answers.q4 === "philosophy") q4Playfulness = 38;

  let q1Playfulness = 50;
  if (answers.q1 === "catalyst") q1Playfulness = 95;
  else if (answers.q1 === "contributor") q1Playfulness = 75;
  else if (answers.q1 === "gentle") q1Playfulness = 50;
  else if (answers.q1 === "observer") q1Playfulness = 30;

  let rawPlayfulness = q4Playfulness * 0.45 + q1Playfulness * 0.35 + q3Score * 0.2;

  // 4. Polymathic Curiosity (0-100)
  const sharedInterests: string[] = Array.isArray(answers.q6) ? (answers.q6 as string[]) : [];
  let interestBase = 35;
  if (sharedInterests.length === 1) interestBase = 48;
  else if (sharedInterests.length === 2) interestBase = 68;
  else if (sharedInterests.length === 3) interestBase = 84;
  else if (sharedInterests.length >= 4) interestBase = 96;

  // Bonus for multidisciplinary combination
  if (sharedInterests.includes("philosophy_psych") || sharedInterests.includes("design_architecture")) {
    interestBase = Math.min(98, interestBase + 4);
  }
  let rawCuriosity = interestBase * 0.7 + (q4Score >= 80 ? 25 : 12);

  // 5. Sensory & Adventure (0-100)
  let q7Adventure = 50;
  if (answers.q7 === "explorer") q7Adventure = 95;
  else if (answers.q7 === "hands_on") q7Adventure = 84;
  else if (answers.q7 === "cozy") q7Adventure = 52;
  else if (answers.q7 === "reflective") q7Adventure = 30;

  let q8Adventure = 55;
  if (answers.q8 === "omnivore_adventurous") q8Adventure = 96;
  else if (answers.q8 === "non_vegetarian") q8Adventure = 76;
  else if (answers.q8 === "vegan") q8Adventure = 72;
  else if (answers.q8 === "eggetarian") q8Adventure = 62;
  else if (answers.q8 === "vegetarian") q8Adventure = 58;
  else if (answers.q8 === "jain") q8Adventure = 50;

  let rawAdventure = q7Adventure * 0.65 + q8Adventure * 0.35;

  // Dietary and Allergies parsing
  const dietary = typeof answers.q8 === "string" ? answers.q8 : "Vegetarian";
  const allergies: string[] = Array.isArray(answers.q12) ? (answers.q12 as string[]) : [];
  const boundaries: string[] = Array.isArray(answers.q13) ? (answers.q13 as string[]) : [];
  const preferredCity = "Delhi NCR";

  // Clamp normalized scores between 12 and 98 for rich human diversity
  const clamp = (val: number) => Math.min(98, Math.max(12, Math.round(val)));
  const socialEnergy = clamp(rawSocialEnergy);
  const conversationDepth = clamp(rawConversationDepth);
  const playfulness = clamp(rawPlayfulness);
  const curiosity = clamp(rawCuriosity);
  const adventure = clamp(rawAdventure);

  // --------------------------------------------------------------------------
  // ARCHETYPE CLASSIFICATION (8 Distinct Personas)
  // --------------------------------------------------------------------------
  let archetypeTitle = "The Curious Flâneur";
  let archetypeDescription =
    "You balance thoughtful observation with warm conversation, drawn to authentic stories and hidden creative corners.";
  let keyTraits = ["Observant", "Culture Enthusiast", "Unhurried Listener"];
  let seatingSynergy =
    "The quintessential table chameleon; harmonizes naturally across any group composition with easy grace and unhurried charm.";
  let conversationalGift =
    "You read the room with subtle wisdom and find authentic common ground with companions from every walk of life.";
  let idealAmbience =
    "Artisanal supper club with a curated heritage menu, warm candlelight, soft vinyl acoustics, and eclectic kindred spirits.";

  // 1. The Radiant Catalyst (High Social Energy + High Playfulness)
  if (socialEnergy >= 68 && playfulness >= 65) {
    archetypeTitle = "The Radiant Catalyst";
    archetypeDescription =
      "Luminous, spontaneous, and socially magnetic. You bring vibrant warmth to the table, turning strangers into lifelong co-conspirators in joyful dialogue.";
    keyTraits = ["Expressive Catalyst", "Social Magnet", "Effortless Connector"];
    seatingSynergy =
      "Pairs exquisitely opposite quiet, deep listeners; bridges table discussions and keeps laughter circulating without dominating.";
    conversationalGift =
      "You break down social barriers instantly, creating an infectious atmosphere where everyone feels liberated to share.";
    idealAmbience =
      "Buzzing private dining loft, shared tasting courses, lively natural wine pairings, and vibrant ambient energy.";
  }
  // 2. The Deep Philosopher (High Conversation Depth + Reflective Energy)
  else if (conversationDepth >= 72 && socialEnergy < 68) {
    archetypeTitle = "The Deep Philosopher";
    archetypeDescription =
      "You bypass superficial small talk in search of life's real questions, seeking existential wonder, authentic perspective, and intellectual intimacy.";
    keyTraits = ["Insightful", "Authentic", "Introspective"];
    seatingSynergy =
      "Flourishes next to empathetic listeners and bold thinkers; anchors the table beyond surface pleasantries into transformative dialogue.";
    conversationalGift =
      "You ask the questions that make people pause, reflect, and speak directly from their soul rather than their resume.";
    idealAmbience =
      "Candlelit courtyard or hidden library salon, unhurried 4-course tasting, soft jazz, and zero corporate posturing.";
  }
  // 3. The Epicurean Explorer (High Adventure + Curiosity)
  else if (adventure >= 72 && curiosity >= 65) {
    archetypeTitle = "The Epicurean Explorer";
    archetypeDescription =
      "Sensory-driven, daring, and bold. You treat every supper as an uncharted voyage into rare flavors, unexpected stories, and spontaneous encounters.";
    keyTraits = ["Adventurous", "Sensory-Driven", "Spontaneous"];
    seatingSynergy =
      "Brings culinary zest and bold momentum to the gathering; ignites table excitement over rare ingredients, hidden travels, and daring moves.";
    conversationalGift =
      "You invite companions into your sensory world, turning ordinary dining moments into shared, memorable celebrations.";
    idealAmbience =
      "Chef's counter tasting room, rare regional spices, experimental pairings, and communal sensory discovery.";
  }
  // 4. The Polymathic Maker (High Polymathic Curiosity + Depth)
  else if (curiosity >= 78 && conversationDepth >= 58) {
    archetypeTitle = "The Polymathic Maker";
    archetypeDescription =
      "Eclectic intellect intersecting architecture, literature, technology, and human psychology. You are boundlessly inquisitive and connect disparate worlds.";
    keyTraits = ["Eclectic Mind", "Pattern Seeker", "Voracious Learner"];
    seatingSynergy =
      "Cross-pollinates between varied disciplines; sparks delight for anyone curious about design, science, and the human spirit.";
    conversationalGift =
      "You connect seemingly unrelated dots, offering unexpected analogies and perspectives that expand the room's worldview.";
    idealAmbience =
      "Design-forward studio or rooftop conservatory, artisanal craft infusions, and eclectic culinary courses.";
  }
  // 5. The Playful Wit (High Playfulness)
  else if (playfulness >= 72) {
    archetypeTitle = "The Playful Wit";
    archetypeDescription =
      "Master of spontaneous banter, comedic timing, and charming levity. You keep the table buoyant, delightfully witty, and effortlessly alive.";
    keyTraits = ["Quick-Witted", "Playful Banter", "Lighthearted Joy"];
    seatingSynergy =
      "The comedic and energetic rhythm keeper; effortlessly softens tensions and turns anecdotes into hilarious shared memories.";
    conversationalGift =
      "You bring irrepressible lightness and clever timing, ensuring everyone leaves the table smiling and refreshed.";
    idealAmbience =
      "Warm bistro cellar, sparkling pairings, artisanal tapas courses, and an open, relaxed seating arrangement.";
  }
  // 6. The Grounded Observer (Reflective Social Energy + Strong Depth)
  else if (socialEnergy <= 45 && conversationDepth >= 55) {
    archetypeTitle = "The Grounded Observer";
    archetypeDescription =
      "A calming, mindful anchor at the table. You listen with wholehearted presence, offering poignant observations when you speak and making others feel genuinely heard.";
    keyTraits = ["Mindful", "Empathetic", "Grounded Anchor"];
    seatingSynergy =
      "The mindful emotional anchor; offers profound insights that make every guest feel profoundly understood.";
    conversationalGift =
      "You listen with your whole attention. When you speak, the entire table quiets because every thought is poignant.";
    idealAmbience =
      "Intimate hearthside table, botanical infusions, comforting slow-cooked fare, and gentle acoustic warmth.";
  }
  // 7. The Intimate Confidant (Intimate Group Preference + Deep Connection)
  else if (conversationDepth >= 75 && (answers.q9 === "4_people" || socialEnergy <= 55)) {
    archetypeTitle = "The Intimate Confidant";
    archetypeDescription =
      "You cherish authentic vulnerability and soul-stirring connections. You have a rare gift for making people drop their social masks and feel completely safe.";
    keyTraits = ["Soulful", "Safe Haven", "Authentic Bond"];
    seatingSynergy =
      "Draws out unspoken truths and vulnerabilities; creates genuine, enduring bonds that transcend a single dinner.";
    conversationalGift =
      "You establish immediate trust and genuine rapport, inspiring deep vulnerability without judgment.";
    idealAmbience =
      "Dimly lit alcove, velvet banquettes, bespoke dessert pairing, and minimal ambient noise.";
  }

  // Dynamic compatibility rating (92% - 99%)
  const compatibilityRating = Math.min(
    99,
    Math.max(92, Math.round(92 + ((curiosity * 3 + conversationDepth * 2 + socialEnergy) % 8)))
  );

  const quizAnswers = generateQuizAnswerRecords(answers);

  return {
    algorithmVersion: "v1.0.0",
    archetype: {
      title: archetypeTitle,
      description: archetypeDescription,
      keyTraits,
      seatingSynergy,
      conversationalGift,
      idealAmbience,
      compatibilityRating,
    },
    dimensions: {
      socialEnergy,
      conversationDepth,
      playfulness,
      curiosity,
      adventure,
      sharedInterests,
      dietary,
      allergies,
      boundaries,
      preferredCity,
    },
    quizAnswers,
  };
}

/**
 * Calculates compatibility score (0-100) between two users or a user and a table group.
 */
export function calculateGroupCompatibility(
  userA: SocialProfileScores["dimensions"],
  userB: SocialProfileScores["dimensions"],
): { score: number; compatible: boolean; matchReason: string } {
  // Soft weights
  const energyDiff = Math.abs(userA.socialEnergy - userB.socialEnergy);
  const depthDiff = Math.abs(userA.conversationDepth - userB.conversationDepth);

  // Shared interests overlap
  const shared = userA.sharedInterests.filter((i) => userB.sharedInterests.includes(i));
  const interestBonus = Math.min(25, shared.length * 8);

  // Distance penalty
  const distancePenalty = energyDiff * 0.3 + depthDiff * 0.4;

  let rawScore = 80 + interestBonus - distancePenalty;
  const score = Math.min(99, Math.max(50, Math.round(rawScore)));

  let matchReason = "Complementary conversational rhythms and shared curiosity.";
  if (shared.length > 0 && shared[0]) {
    matchReason = `Bonded over shared appreciation for ${shared[0].replace("_", " ")} and deep conversation.`;
  }

  return {
    score,
    compatible: score >= 65,
    matchReason,
  };
}
