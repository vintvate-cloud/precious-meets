import { describe, expect, it } from "vitest";
import { calculateSocialProfile, calculateGroupCompatibility } from "@/lib/scoring-engine";

describe("Social Scoring Engine", () => {
  it("computes dynamic archetype and dimensions for a high-energy catalyst", () => {
    const catalystAnswers = {
      q1: "catalyst",
      q2: "energized",
      q3: 85,
      q4: "playful_banter",
      q5: 60,
      q6: ["food_wine", "music_subcultures"],
      q7: "explorer",
      q8: "vegetarian",
      q9: "8_people",
    };

    const result = calculateSocialProfile(catalystAnswers);

    expect(result.algorithmVersion).toBe("v1.0.0");
    expect(result.dimensions.socialEnergy).toBeGreaterThanOrEqual(75);
    expect(result.dimensions.playfulness).toBeGreaterThanOrEqual(65);
    expect(result.archetype.title).toBe("The Radiant Catalyst");
    expect(result.archetype.keyTraits).toContain("Expressive Catalyst");
    expect(result.archetype.compatibilityRating).toBeGreaterThanOrEqual(92);
    expect(result.quizAnswers.length).toBeGreaterThan(0);
  });

  it("computes distinct archetype for a deep introspective philosopher", () => {
    const philosopherAnswers = {
      q1: "observer",
      q2: "drained",
      q3: 20,
      q4: "philosophy",
      q5: 10, // zero tolerance for small talk
      q6: ["philosophy_psych", "literature_cinema"],
      q7: "reflective",
      q8: "vegetarian",
      q9: "4_people",
    };

    const result = calculateSocialProfile(philosopherAnswers);

    expect(result.dimensions.conversationDepth).toBeGreaterThanOrEqual(75);
    expect(result.dimensions.socialEnergy).toBeLessThan(45);
    expect(["The Deep Philosopher", "The Grounded Observer", "The Intimate Confidant"]).toContain(
      result.archetype.title
    );
    expect(result.archetype.seatingSynergy).toBeDefined();
    expect(result.archetype.conversationalGift).toBeDefined();
    expect(result.archetype.idealAmbience).toBeDefined();
  });

  it("computes distinct archetype for an adventurous explorer", () => {
    const explorerAnswers = {
      q1: "contributor",
      q2: "fulfilled_balanced",
      q3: 60,
      q4: "travel_observations",
      q5: 50,
      q6: ["food_wine", "design_architecture", "tech_ai", "music_subcultures"],
      q7: "explorer",
      q8: "omnivore_adventurous",
      q9: "6_people",
    };

    const result = calculateSocialProfile(explorerAnswers);

    expect(result.dimensions.adventure).toBeGreaterThanOrEqual(72);
    expect(result.dimensions.curiosity).toBeGreaterThanOrEqual(65);
    expect(["The Epicurean Explorer", "The Polymathic Maker"]).toContain(result.archetype.title);
  });

  it("calculates group compatibility score with shared interests bonus", () => {
    const userA = {
      socialEnergy: 75,
      conversationDepth: 70,
      playfulness: 65,
      curiosity: 80,
      adventure: 70,
      sharedInterests: ["food_wine", "cinema_books"],
      dietary: "vegetarian",
      allergies: [],
      boundaries: [],
      preferredCity: "Delhi NCR",
    };

    const userB = {
      socialEnergy: 70,
      conversationDepth: 65,
      playfulness: 60,
      curiosity: 75,
      adventure: 65,
      sharedInterests: ["food_wine", "philosophy_psych"],
      dietary: "vegetarian",
      allergies: [],
      boundaries: [],
      preferredCity: "Delhi NCR",
    };

    const match = calculateGroupCompatibility(userA, userB);

    expect(match.compatible).toBe(true);
    expect(match.score).toBeGreaterThanOrEqual(75);
    expect(match.matchReason).toContain("food wine");
  });
});
