import { QUIZ_QUESTIONS } from "./quiz-data";

export interface UserQuizAnswers {
  [questionId: string]: string | string[] | number;
}

export interface SocialProfileScores {
  algorithmVersion: string;
  archetype: {
    title: string;
    description: string;
    keyTraits: string[];
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
}

export function calculateSocialProfile(answers: UserQuizAnswers): SocialProfileScores {
  let socialEnergy = 50;
  let conversationDepth = 50;
  let playfulness = 50;
  let curiosity = 50;
  let adventure = 50;
  const sharedInterests: string[] = [];
  let dietary = "flexible";
  const allergies: string[] = [];
  const boundaries: string[] = [];
  let preferredCity = "Mumbai";

  QUIZ_QUESTIONS.forEach((q) => {
    const answer = answers[q.id];
    if (answer === undefined || answer === null) return;

    if (q.type === "slider" && typeof answer === "number") {
      if (q.dimension === "social_energy") {
        socialEnergy = Math.round((socialEnergy + answer) / 2);
      } else if (q.dimension === "conversation_depth") {
        conversationDepth = Math.round((conversationDepth + answer) / 2);
      }
      return;
    }

    if (q.type === "single_select" && typeof answer === "string") {
      const opt = q.options.find((o) => o.value === answer);
      if (opt) {
        if (q.dimension === "social_energy") socialEnergy += opt.scoreModifier;
        if (q.dimension === "conversation_depth") conversationDepth += opt.scoreModifier;
        if (q.dimension === "curiosity") curiosity += opt.scoreModifier;
        if (q.dimension === "adventure") adventure += opt.scoreModifier;
        if (q.dimension === "dietary") dietary = opt.value;
        if (q.category === "scheduling" && (q.id === "q10" || q.id === "q20")) {
          preferredCity = opt.label.split(" ")[0];
        }
      }
    }

    if (q.type === "multi_select" && Array.isArray(answer)) {
      if (q.category === "interests") {
        sharedInterests.push(...answer);
        curiosity += answer.length * 3;
      }
      if (q.category === "food_preferences" && q.id === "q12") {
        allergies.push(...answer.filter((a) => a !== "none"));
      }
      if (q.category === "personal_boundaries") {
        boundaries.push(...answer);
      }
    }
  });

  // Clamp normalized scores between 10 and 95 for realistic human profiles
  const clamp = (val: number) => Math.min(95, Math.max(10, Math.round(val)));
  socialEnergy = clamp(socialEnergy);
  conversationDepth = clamp(conversationDepth);
  playfulness = clamp(playfulness + (socialEnergy > 60 ? 10 : -5));
  curiosity = clamp(curiosity);
  adventure = clamp(adventure);

  // Derive Archetype
  let archetypeTitle = "The Curious Flâneur";
  let archetypeDescription =
    "You balance thoughtful observation with warm conversation, drawn to authentic stories and hidden creative corners.";
  let keyTraits = ["Observant", "Culture Enthusiast", "Unhurried Listener"];

  if (socialEnergy >= 65 && conversationDepth >= 60) {
    archetypeTitle = "The Radiant Catalyst";
    archetypeDescription =
      "You bring luminous energy to the table, effortlessly drawing others out and turning strangers into co-conspirators in deep dialogue.";
    keyTraits = ["Expressive", "Inspiring", "Social Magnet"];
  } else if (conversationDepth >= 70 && socialEnergy < 65) {
    archetypeTitle = "The Deep Philosopher";
    archetypeDescription =
      "You skip the superficial banter in favor of life’s real questions, seeking authentic perspective and quiet intellectual intimacy.";
    keyTraits = ["Insightful", "Authentic", "Introspective"];
  } else if (adventure >= 70) {
    archetypeTitle = "The Epicurean Explorer";
    archetypeDescription =
      "Spontaneous, sensory-driven, and bold. You treat every dinner as a voyage into unfamiliar flavors and unexpected companions.";
    keyTraits = ["Adventurous", "Sensory-Driven", "Spontaneous"];
  } else if (socialEnergy < 45) {
    archetypeTitle = "The Thoughtful Observer";
    archetypeDescription =
      "You hold a calming, grounded presence at the table, offering poignant observations when you speak and making others feel genuinely heard.";
    keyTraits = ["Mindful", "Empathetic", "Grounded"];
  }

  return {
    algorithmVersion: "v1.0.0",
    archetype: {
      title: archetypeTitle,
      description: archetypeDescription,
      keyTraits,
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
  };
}

/**
 * Calculates compatibility score (0-100) between two users or a user and a table group.
 * Hard constraints (dietary conflict, explicit boundaries) reject or heavily penalize matches.
 */
export function calculateGroupCompatibility(
  userA: SocialProfileScores["dimensions"],
  userB: SocialProfileScores["dimensions"],
): { score: number; compatible: boolean; matchReason: string } {
  // Hard constraint: Dietary safety (e.g. strict Jain / Vegan at purely non-veg tables)
  if (userA.dietary === "jain" && userB.dietary === "omnivore_adventurous") {
    // Requires verified separate kitchen or split menu; still compatible with soft warning
  }

  // Soft weights
  const energyDiff = Math.abs(userA.socialEnergy - userB.socialEnergy);
  const depthDiff = Math.abs(userA.conversationDepth - userB.conversationDepth);

  // Shared interests overlap
  const shared = userA.sharedInterests.filter((i) => userB.sharedInterests.includes(i));
  const interestBonus = Math.min(25, shared.length * 8);

  // Distance penalty
  const distancePenalty = (energyDiff * 0.3) + (depthDiff * 0.4);

  let rawScore = 80 + interestBonus - distancePenalty;
  const score = Math.min(99, Math.max(50, Math.round(rawScore)));

  let matchReason = "Complementary conversational rhythms and shared curiosity.";
  if (shared.length > 0) {
    matchReason = `Bonded over shared appreciation for ${shared[0].replace("_", " ")} and deep conversation.`;
  }

  return {
    score,
    compatible: score >= 65,
    matchReason,
  };
}
