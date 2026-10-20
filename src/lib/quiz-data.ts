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
    | "group_preferences"
    | "scheduling";
  title: string;
  subtitle?: string;
  type: "single_select" | "multi_select" | "slider";
  dimension:
    | "social_energy"
    | "conversation_depth"
    | "curiosity"
    | "adventure"
    | "dietary"
    | "schedule";
  isRequired: boolean;
  options: QuizOption[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderLabels?: { left: string; right: string };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. Social Energy - Focus
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

  // 2. Social Energy - Recharge
  {
    id: "q2",
    order: 2,
    category: "social_energy",
    title: "How do you feel after a three-hour dinner with strangers?",
    subtitle: "Understanding your stamina ensures comfortable dinner pacing.",
    type: "single_select",
    dimension: "social_energy",
    isRequired: true,
    options: [
      { id: "q2_1", label: "Wonderfully energized", sublabel: "Ready for a midnight dessert or nightcap conversation", value: "energized", scoreModifier: 10 },
      { id: "q2_2", label: "Warmly contented & balanced", sublabel: "Fulfilled by genuine chats, retreating comfortably to unwind", value: "fulfilled_balanced", scoreModifier: 2 },
      { id: "q2_3", label: "Deeply touched but drained", sublabel: "Valued every moment, but craving silent solo recharge time", value: "drained", scoreModifier: -8 },
    ],
  },

  // 3. Social Energy - Tempo
  {
    id: "q3",
    order: 3,
    category: "social_energy",
    title: "Your ideal table tempo & conversational pace",
    subtitle: "Slide to calibrate between slow reflection and electric group buzz.",
    type: "slider",
    dimension: "social_energy",
    isRequired: true,
    options: [],
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderLabels: { left: "Intimate & Slow", right: "Lively & Buzzing" },
  },

  // 4. Conversation Depth - Topics
  {
    id: "q4",
    order: 4,
    category: "conversation_style",
    title: "Which conversational direction excites you the most?",
    subtitle: "We skip polite corporate banter in favor of real curiosity.",
    type: "single_select",
    dimension: "conversation_depth",
    isRequired: true,
    options: [
      { id: "q4_1", label: "Personal Crossroads & Turning Points", sublabel: "Stories of change, failure, resilience, and reinvention", value: "turning_points", scoreModifier: 10 },
      { id: "q4_2", label: "Playful Debates & Quirky Opinions", sublabel: "Good-humored banter about quirks, tastes, and culture", value: "playful_banter", scoreModifier: 4 },
      { id: "q4_3", label: "Art, Philosophy & Big Ideas", sublabel: "Examining how society, beauty, design, and humanity intersect", value: "philosophy", scoreModifier: 9 },
      { id: "q4_4", label: "Travel, Food & Hidden Gems", sublabel: "Unexpected discoveries, sensory memories, and local stories", value: "travel_observations", scoreModifier: 3 },
    ],
  },

  // 5. Conversation Depth - Small Talk Tolerance
  {
    id: "q5",
    order: 5,
    category: "conversation_style",
    title: "Your tolerance for small talk",
    subtitle: "How quickly do you prefer venturing past surface pleasantries?",
    type: "slider",
    dimension: "conversation_depth",
    isRequired: true,
    options: [],
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderLabels: { left: "Zero tolerance (Dive deep)", right: "Enjoy gentle warm-up first" },
  },

  // 6. Cultural Interests & Curiosities
  {
    id: "q6",
    order: 6,
    category: "interests",
    title: "Select the cultural and creative domains that captivate you",
    subtitle: "Pick up to 4 passions you could discuss for hours over candlelight.",
    type: "multi_select",
    dimension: "curiosity",
    isRequired: true,
    options: [
      { id: "q6_1", label: "Culinary Heritage & Wine", value: "food_wine", scoreModifier: 5 },
      { id: "q6_2", label: "Literature & Independent Cinema", value: "cinema_books", scoreModifier: 6 },
      { id: "q6_3", label: "Design, Architecture & Urbanism", value: "design_architecture", scoreModifier: 6 },
      { id: "q6_4", label: "Philosophy & Human Psychology", value: "philosophy_psych", scoreModifier: 8 },
      { id: "q6_5", label: "Technology, AI & The Future", value: "tech_ai", scoreModifier: 5 },
      { id: "q6_6", label: "Live Music & Underground Subcultures", value: "music_subcultures", scoreModifier: 7 },
    ],
  },

  // 7. Lifestyle & Spontaneity
  {
    id: "q7",
    order: 7,
    category: "lifestyle",
    title: "How do you spend a free Saturday afternoon in your city?",
    subtitle: "Gives us a sense of your rhythm and spontaneous nature.",
    type: "single_select",
    dimension: "adventure",
    isRequired: true,
    options: [
      { id: "q7_1", label: "Exploring a new neighborhood or hidden lane", sublabel: "Curious exploration on foot without a rigid itinerary", value: "explorer", scoreModifier: 8 },
      { id: "q7_2", label: "Lingering in a bookstore café with a notebook", sublabel: "Slow coffee, thoughtful reading, people watching", value: "reflective", scoreModifier: -2 },
      { id: "q7_3", label: "Trying an experimental culinary or art workshop", sublabel: "Sensory immersion, hands-on craft or tasting", value: "hands_on", scoreModifier: 6 },
      { id: "q7_4", label: "Hosting or gathering with close kindred spirits", sublabel: "Cozy gatherings with vinyl music and home brews", value: "cozy", scoreModifier: 1 },
    ],
  },

  // 8. Food & Dining Preferences
  {
    id: "q8",
    order: 8,
    category: "food_preferences",
    title: "Your dining orientation",
    subtitle: "Essential so our hosts curate safe, delightful tasting courses for you.",
    type: "single_select",
    dimension: "dietary",
    isRequired: true,
    options: [
      { id: "q8_1", label: "Vegetarian", sublabel: "Plant-based and dairy; no meat or seafood", value: "vegetarian", scoreModifier: 0 },
      { id: "q8_2", label: "Jain Vegetarian", sublabel: "Strictly no root vegetables, onion, or garlic", value: "jain", scoreModifier: 0 },
      { id: "q8_3", label: "Vegan", sublabel: "100% plant-based cuisine", value: "vegan", scoreModifier: 0 },
      { id: "q8_4", label: "Eggetarian", sublabel: "Vegetarian with artisanal eggs included", value: "eggetarian", scoreModifier: 0 },
      { id: "q8_5", label: "Non-Vegetarian / Omnivore", sublabel: "Enjoy poultry, artisanal meats, and seafood", value: "non_vegetarian", scoreModifier: 0 },
      { id: "q8_6", label: "Culinary Adventurer", sublabel: "Open to rare ingredients, chef specials, and paired wines", value: "omnivore_adventurous", scoreModifier: 5 },
    ],
  },

  // 9. Group Preferences
  {
    id: "q9",
    order: 9,
    category: "group_preferences",
    title: "What is your golden group size for memorable conversation?",
    subtitle: "We keep all Precious Meets intentionally intimate.",
    type: "single_select",
    dimension: "social_energy",
    isRequired: true,
    options: [
      { id: "q9_1", label: "Micro Table: 4 people", sublabel: "Ultra-deep, single focused dialogue where everyone bonds", value: "4_people", scoreModifier: -5 },
      { id: "q9_2", label: "Classic Supper: 6 people", sublabel: "The sweet spot: rich diversity without splintering into side chats", value: "6_people", scoreModifier: 2 },
      { id: "q9_3", label: "Salon Gathering: 8 people", sublabel: "Vibrant energy with multiple viewpoints and sparks", value: "8_people", scoreModifier: 7 },
    ],
  },

  // 10. Scheduling & City
  {
    id: "q10",
    order: 10,
    category: "scheduling",
    title: "Which city would you like to experience first?",
    subtitle: "Where our culinary team will reserve your inaugural seat.",
    type: "single_select",
    dimension: "schedule",
    isRequired: true,
    options: [
      { id: "q10_1", label: "Mumbai", sublabel: "Bandra, Colaba, Juhu, Lower Parel", value: "mumbai", scoreModifier: 0 },
      { id: "q10_2", label: "Bengaluru", sublabel: "Indiranagar, Koramangala, Lavelle Road", value: "bengaluru", scoreModifier: 0 },
      { id: "q10_3", label: "Delhi NCR", sublabel: "Hauz Khas, Mehrauli, Golf Course Road", value: "delhi", scoreModifier: 0 },
    ],
  },
];
