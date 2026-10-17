export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  scoreModifier: number; // -10 to +10 for dimension
}

export interface QuizQuestion {
  id: string;
  order: number;
  category:
    | "social_energy"
    | "conversation_style"
    | "interests"
    | "lifestyle"
    | "food_preferences"
    | "experience_preferences"
    | "group_preferences"
    | "communication"
    | "personal_boundaries"
    | "scheduling";
  title: string;
  subtitle?: string;
  type: "single_select" | "multi_select" | "slider";
  dimension:
    | "social_energy"
    | "conversation_depth"
    | "playfulness"
    | "curiosity"
    | "adventure"
    | "dietary"
    | "boundaries"
    | "schedule";
  isRequired: boolean;
  options: QuizOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderLabels?: { left: string; right: string };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Social Energy
  {
    id: "q1",
    order: 1,
    category: "social_energy",
    title: "At a gathering of unfamiliar people, where do you find your focus?",
    subtitle: "There are no wrong answers; this helps us balance energy at the table.",
    type: "single_select",
    dimension: "social_energy",
    isRequired: true,
    options: [
      { id: "q1_1", label: "Quiet Observer", sublabel: "Taking in the room and listening to stories first", value: "observer", scoreModifier: -8 },
      { id: "q1_2", label: "Gentle Engager", sublabel: "Connecting intimately with one or two people nearby", value: "gentle", scoreModifier: -2 },
      { id: "q1_3", label: "Active Contributor", sublabel: "Comfortably chiming in and bouncing off topics", value: "contributor", scoreModifier: 5 },
      { id: "q1_4", label: "Vibrant Catalyst", sublabel: "Naturally fueling laughs and bridging introductions", value: "catalyst", scoreModifier: 10 },
    ],
  },
  {
    id: "q2",
    order: 2,
    category: "social_energy",
    title: "How do you feel after a three-hour dinner with strangers?",
    type: "single_select",
    dimension: "social_energy",
    isRequired: true,
    options: [
      { id: "q2_1", label: "Wonderfully energized", sublabel: "Ready for a midnight dessert or nightcap", value: "energized", scoreModifier: 10 },
      { id: "q2_2", label: "Fulfilled but ready for home", sublabel: "Warmly contented, retreating to quiet space", value: "fulfilled_balanced", scoreModifier: 2 },
      { id: "q2_3", label: "Deeply touched but drained", sublabel: "Needing solo silence to process and recharge", value: "drained", scoreModifier: -8 },
    ],
  },
  {
    id: "q3",
    order: 3,
    category: "social_energy",
    title: "Your ideal table tempo",
    type: "slider",
    dimension: "social_energy",
    isRequired: true,
    options: [],
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderLabels: { left: "Intimate & Slow", right: "Lively & Buzzing" },
  },

  // 2. Conversation Style
  {
    id: "q4",
    order: 4,
    category: "conversation_style",
    title: "Which conversational direction excites you the most?",
    subtitle: "We skip polite corporate banter in favor of genuine curiosity.",
    type: "single_select",
    dimension: "conversation_depth",
    isRequired: true,
    options: [
      { id: "q4_1", label: "Personal Crossroads & Life Turning Points", sublabel: "Stories of change, failure, resilience, and reinvention", value: "turning_points", scoreModifier: 10 },
      { id: "q4_2", label: "Playful Debates & Unpopular Opinions", sublabel: "Good-humored banter about quirks, tastes, and culture", value: "playful_banter", scoreModifier: 4 },
      { id: "q4_3", label: "Art, Philosophy & Big Ideas", sublabel: "Examining how society, beauty, and technology intersect", value: "philosophy", scoreModifier: 9 },
      { id: "q4_4", label: "Travel & Everyday Observations", sublabel: "Unexpected discoveries, sensory memories, and local gems", value: "travel_observations", scoreModifier: 3 },
    ],
  },
  {
    id: "q5",
    order: 5,
    category: "conversation_style",
    title: "When someone introduces a controversial or unorthodox perspective:",
    type: "single_select",
    dimension: "curiosity",
    isRequired: true,
    options: [
      { id: "q5_1", label: "I lean in with questions", sublabel: "Curious to understand what life experiences led them there", value: "curious_inquiry", scoreModifier: 10 },
      { id: "q5_2", label: "I enjoy a rigorous friendly debate", sublabel: "Testing premises with respect and intellect", value: "debate", scoreModifier: 6 },
      { id: "q5_3", label: "I prefer maintaining harmony", sublabel: "Gently steering towards common ground and ease", value: "harmony", scoreModifier: -2 },
    ],
  },
  {
    id: "q6",
    order: 6,
    category: "conversation_style",
    title: "Small talk tolerance",
    type: "slider",
    dimension: "conversation_depth",
    isRequired: true,
    options: [],
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderLabels: { left: "Zero tolerance (Dive deep)", right: "Enjoy light warm-up first" },
  },

  // 3. Interests
  {
    id: "q7",
    order: 7,
    category: "interests",
    title: "Select the cultural and creative domains that captivate you",
    subtitle: "Select up to 4 areas you could talk about endlessly.",
    type: "multi_select",
    dimension: "curiosity",
    isRequired: true,
    options: [
      { id: "q7_1", label: "Culinary Heritage & Wine", value: "food_wine", scoreModifier: 5 },
      { id: "q7_2", label: "Literature & Independent Cinema", value: "cinema_books", scoreModifier: 6 },
      { id: "q7_3", label: "Design, Architecture & Urbanism", value: "design_architecture", scoreModifier: 6 },
      { id: "q7_4", label: "Philosophy & Human Psychology", value: "philosophy_psych", scoreModifier: 8 },
      { id: "q7_5", label: "Technology, AI & The Future", value: "tech_ai", scoreModifier: 5 },
      { id: "q7_6", label: "Nature, Hiking & Wilderness", value: "nature_outdoors", scoreModifier: 5 },
      { id: "q7_7", label: "Live Music & Underground Subcultures", value: "music_subcultures", scoreModifier: 7 },
      { id: "q7_8", label: "Craftsmanship & Analog Hobbies", value: "craft_analog", scoreModifier: 5 },
    ],
  },
  {
    id: "q8",
    order: 8,
    category: "interests",
    title: "How do you spend a free Saturday afternoon in your city?",
    type: "single_select",
    dimension: "adventure",
    isRequired: true,
    options: [
      { id: "q8_1", label: "Exploring a new neighborhood or hidden lane", value: "explorer", scoreModifier: 8 },
      { id: "q8_2", label: "Lingering in a bookstore café with a notebook", value: "reflective", scoreModifier: -2 },
      { id: "q8_3", label: "Trying an experimental workshop or tasting", value: "hands_on", scoreModifier: 6 },
      { id: "q8_4", label: "Hosting or visiting close friends for a home brew", value: "cozy", scoreModifier: 1 },
    ],
  },

  // 4. Lifestyle & Rhythm
  {
    id: "q9",
    order: 9,
    category: "lifestyle",
    title: "What is your primary weekly tempo?",
    type: "single_select",
    dimension: "schedule",
    isRequired: true,
    options: [
      { id: "q9_1", label: "Weekday evenings work best", sublabel: "Unwinding after work Tuesday through Thursday", value: "weekday_evenings", scoreModifier: 0 },
      { id: "q9_2", label: "Friday night decompression", sublabel: "Celebratory dinners to kick off the weekend", value: "friday_nights", scoreModifier: 0 },
      { id: "q9_3", label: "Unhurried Sunday daytime", sublabel: "Long breakfasts, brunches, and slow walks", value: "sunday_daytime", scoreModifier: 0 },
      { id: "q9_4", label: "Saturday late evenings", sublabel: "Candlelight, wine, and immersive dinner salons", value: "saturday_evenings", scoreModifier: 0 },
    ],
  },
  {
    id: "q10",
    order: 10,
    category: "lifestyle",
    title: "Your attitude toward spontaneous plans",
    type: "single_select",
    dimension: "adventure",
    isRequired: true,
    options: [
      { id: "q10_1", label: "I love last-minute adventures", sublabel: "Spontaneity keeps life thrilling", value: "spontaneous", scoreModifier: 9 },
      { id: "q10_2", label: "Planned spontaneity", sublabel: "Keep the block free, figure out the vibe on the day", value: "planned_spontaneous", scoreModifier: 4 },
      { id: "q10_3", label: "Carefully scheduled in advance", sublabel: "I treasure knowing my week beforehand", value: "structured", scoreModifier: -5 },
    ],
  },

  // 5. Food & Dining Preferences
  {
    id: "q11",
    order: 11,
    category: "food_preferences",
    title: "Your dietary orientation",
    subtitle: "Critical for ensuring every supper table accommodates you safely.",
    type: "single_select",
    dimension: "dietary",
    isRequired: true,
    options: [
      { id: "q11_1", label: "Vegetarian", sublabel: "Plant-based and dairy; no meat or seafood", value: "vegetarian", scoreModifier: 0 },
      { id: "q11_2", label: "Jain Vegetarian", sublabel: "No root vegetables, onion, or garlic", value: "jain", scoreModifier: 0 },
      { id: "q11_3", label: "Vegan", sublabel: "Strictly 100% plant-based", value: "vegan", scoreModifier: 0 },
      { id: "q11_4", label: "Eggetarian", sublabel: "Vegetarian with eggs included", value: "eggetarian", scoreModifier: 0 },
      { id: "q11_5", label: "Non-Vegetarian / Omnivore", sublabel: "Enjoy meats, poultry, and seafood", value: "non_vegetarian", scoreModifier: 0 },
      { id: "q11_6", label: "Culinary Adventurer", sublabel: "Eats anything artisanal, rare, and authentic", value: "omnivore_adventurous", scoreModifier: 5 },
    ],
  },
  {
    id: "q12",
    order: 12,
    category: "food_preferences",
    title: "Do you have any severe food allergies?",
    subtitle: "Select all that apply so hosts can sanitize preparation surfaces.",
    type: "multi_select",
    dimension: "dietary",
    isRequired: false,
    options: [
      { id: "q12_1", label: "Tree Nuts & Peanuts", value: "nuts", scoreModifier: 0 },
      { id: "q12_2", label: "Dairy / Lactose Intolerance", value: "dairy", scoreModifier: 0 },
      { id: "q12_3", label: "Gluten / Celiac", value: "gluten", scoreModifier: 0 },
      { id: "q12_4", label: "Shellfish / Seafood", value: "shellfish", scoreModifier: 0 },
      { id: "q12_5", label: "None / No restrictions", value: "none", scoreModifier: 0 },
    ],
  },
  {
    id: "q13",
    order: 13,
    category: "food_preferences",
    title: "Relationship with alcohol & pairings",
    type: "single_select",
    dimension: "dietary",
    isRequired: true,
    options: [
      { id: "q13_1", label: "Enthusiastic (Wine & Cocktails)", sublabel: "Love exploring natural wines and paired drinks", value: "wine_enthusiast", scoreModifier: 5 },
      { id: "q13_2", label: "Occasional / Moderate", sublabel: "A casual glass or craft cider is lovely", value: "moderate", scoreModifier: 2 },
      { id: "q13_3", label: "Non-drinker / Mocktails only", sublabel: "Prefer botanical tonics, kombucha, and tea", value: "non_drinker", scoreModifier: -2 },
    ],
  },

  // 6. Experience Preferences
  {
    id: "q14",
    order: 14,
    category: "experience_preferences",
    title: "Which environment draws you in?",
    type: "single_select",
    dimension: "adventure",
    isRequired: true,
    options: [
      { id: "q14_1", label: "Hidden Loft / Private Chef’s Table", sublabel: "Candlelight, warm woods, vinyl music playing softly", value: "loft_table", scoreModifier: 5 },
      { id: "q14_2", label: "Sunlit Artisan Courtyard", sublabel: "Breezy greenery, slow pour-overs, garden banter", value: "courtyard", scoreModifier: 2 },
      { id: "q14_3", label: "Curated Historic Walk & Rooftop", sublabel: "Movement, storytelling, and scenic evening views", value: "walk_rooftop", scoreModifier: 8 },
      { id: "q14_4", label: "Creative Studio or Listening Room", sublabel: "Intimate, artistic, and sensory-focused", value: "studio_salon", scoreModifier: 6 },
    ],
  },

  // 7. Group Preferences
  {
    id: "q15",
    order: 15,
    category: "group_preferences",
    title: "What is your golden group size for memorable conversation?",
    type: "single_select",
    dimension: "social_energy",
    isRequired: true,
    options: [
      { id: "q15_1", label: "Micro Table: 4 people", sublabel: "Ultra-deep, everyone shares one singular conversation", value: "4_people", scoreModifier: -5 },
      { id: "q15_2", label: "Classic Supper: 6 people", sublabel: "The sweet spot: diverse views without splintering into side chats", value: "6_people", scoreModifier: 2 },
      { id: "q15_3", label: "Salon Gathering: 8 people", sublabel: "Vibrant energy with multiple perspectives and connections", value: "8_people", scoreModifier: 7 },
    ],
  },
  {
    id: "q16",
    order: 16,
    category: "group_preferences",
    title: "Group demographic preference",
    type: "single_select",
    dimension: "curiosity",
    isRequired: true,
    options: [
      { id: "q16_1", label: "Broad generational mix", sublabel: "I love hearing stories from 20s to 50s+", value: "intergenerational", scoreModifier: 8 },
      { id: "q16_2", label: "Peer age group (within ~8 years)", sublabel: "Sharing similar life milestones and career stages", value: "peer_group", scoreModifier: 0 },
      { id: "q16_3", label: "Open to anyone with an open heart", sublabel: "Vibe matters vastly more than birth year", value: "open_heart", scoreModifier: 10 },
    ],
  },

  // 8. Communication Style
  {
    id: "q17",
    order: 17,
    category: "communication",
    title: "Preferred languages spoken at your table",
    subtitle: "All tables default to conversational ease.",
    type: "multi_select",
    dimension: "curiosity",
    isRequired: true,
    options: [
      { id: "q17_1", label: "English", value: "english", scoreModifier: 0 },
      { id: "q17_2", label: "Hindi", value: "hindi", scoreModifier: 0 },
      { id: "q17_3", label: "Regional / Bilingual blend (Hinglish/Kangaroo)", value: "blend", scoreModifier: 3 },
    ],
  },
  {
    id: "q18",
    order: 18,
    category: "communication",
    title: "Your listening vs. speaking balance",
    type: "slider",
    dimension: "social_energy",
    isRequired: true,
    options: [],
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderLabels: { left: "Chief Listener", right: "Storyteller & Speaker" },
  },

  // 9. Personal Boundaries & Dislikes
  {
    id: "q19",
    order: 19,
    category: "personal_boundaries",
    title: "Topics you prefer leaving outside the dining room",
    subtitle: "We enforce table agreements so everyone feels safe and respected.",
    type: "multi_select",
    dimension: "boundaries",
    isRequired: false,
    options: [
      { id: "q19_1", label: "Aggressive Corporate Networking & Pitching", value: "no_pitching", scoreModifier: 0 },
      { id: "q19_2", label: "Polarizing Partisan Politics", value: "no_politics", scoreModifier: 0 },
      { id: "q19_3", label: "Crypto / Financial Speculation", value: "no_crypto", scoreModifier: 0 },
      { id: "q19_4", label: "Prying relationship interrogation", value: "no_prying", scoreModifier: 0 },
    ],
  },

  // 10. Scheduling & Readiness
  {
    id: "q20",
    order: 20,
    category: "scheduling",
    title: "Which city would you like to experience first?",
    type: "single_select",
    dimension: "schedule",
    isRequired: true,
    options: [
      { id: "q20_1", label: "Mumbai", sublabel: "Bandra, Colaba, Juhu, Lower Parel", value: "mumbai", scoreModifier: 0 },
      { id: "q20_2", label: "Bengaluru", sublabel: "Indiranagar, Koramangala, Lavelle Road", value: "bengaluru", scoreModifier: 0 },
      { id: "q20_3", label: "Delhi NCR", sublabel: "Hauz Khas, Mehrauli, Golf Course Road", value: "delhi", scoreModifier: 0 },
    ],
  },
  {
    id: "q21",
    order: 21,
    category: "scheduling",
    title: "How soon are you ready to join a table?",
    type: "single_select",
    dimension: "schedule",
    isRequired: true,
    options: [
      { id: "q21_1", label: "This upcoming weekend", sublabel: "Ready to discover my people immediately", value: "this_weekend", scoreModifier: 10 },
      { id: "q21_2", label: "Within the next 2-3 weeks", sublabel: "Planning an upcoming evening out", value: "few_weeks", scoreModifier: 5 },
      { id: "q21_3", label: "Just exploring for now", sublabel: "Browsing and curating my preferences", value: "browsing", scoreModifier: 0 },
    ],
  },
];
