import { describe, expect, it } from "vitest";
import { calculateSocialProfile, calculateGroupCompatibility } from "@/lib/scoring-engine";

describe("Social Scoring Engine", () => {
  it("computes normalized archetype and dimensions from answers", () => {
    const mockAnswers = {
      q1: "catalyst", // social_energy +10
      q2: "energized", // social_energy +10
      q3: 85, // slider social_energy
      q4: "turning_points", // conversation_depth +10
      q5: "curious_inquiry", // curiosity +10
      q6: 20, // slider conversation_depth
      q7: ["food_wine", "cinema_books", "philosophy_psych"],
      q8: "explorer",
      q11: "vegetarian",
    };

    const result = calculateSocialProfile(mockAnswers);

    expect(result.algorithmVersion).toBe("v1.0.0");
    expect(result.dimensions.socialEnergy).toBeGreaterThan(60);
    expect(result.dimensions.conversationDepth).toBeGreaterThanOrEqual(40);
    expect(result.dimensions.dietary).toBe("vegetarian");
    expect(result.archetype.title).toBeDefined();
    expect(result.archetype.keyTraits.length).toBeGreaterThan(0);
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
