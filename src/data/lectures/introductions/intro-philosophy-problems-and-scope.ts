// src/data/lectures/introductions/intro-philosophy-problems-and-scope.ts
import { Lecture } from '../../../types/lecture';

// Define any constants or helper types here
const philosophyConcepts = {
  // Add your philosophy concepts here as needed
  PHIL_BASICS: 'philosophy-basics',
  PHYSICS: 'physics-nature',
  METAPHYSICS: 'metaphysics',
  ONTOLOGY: 'ontology',
  LOGIC: 'logic',
  EPISTEMOLOGY: 'epistemology',
  AESTHETICS: 'aesthetics',
  ETHICS: 'ethics',
  POLITICAL: 'political-theory',
  ATHENS: 'athens-tradition',
  JERUSALEM: 'jerusalem-tradition'
} as const;

const introPhilosophyProblemsAndScopeLecture: Lecture = {
  id: "intro-philosophy-problems-and-scope",
  title: "Introduction to the Problems and Scope of Philosophy",
  videoUrl: "https://youtu.be/8ZoQ7wh9pSQ?si=XHX9N8ZKrFqWeFCM",
  prerequisites: [],
  fundamentalConcepts: [
    "Metaphysics",
    "Ontology",
    "Logic",
    "Epistemology",
    "Philosophical Psychology",
    "Aesthetics",
    "Ethics",
    "Political Theory",
    "Athens Tradition",
    "Jerusalem Tradition",
    "Logos",
    "Mythos",
    "Faith"
  ],
  readingMaterials: {
    required: [],
    supplementary: []
  },
  prompts: {
    readiness: [
      {
        id: "b2386a68-abe7-4f8b-b9d6-d0325c203f89",
        text: "What do you think is the fundamental nature of reality? Is it purely physical, or might there be something beyond the material world?",
        concepts: [
          "Ontology",
          "Metaphysics"
        ]
      },
      {
        id: "c127073c-728b-4620-ac6a-6ae1a56d837e",
        text: "Do you tend to approach life's big questions through rational analysis, religious faith, or a combination of both? What influences your approach?",
        concepts: [
          "Epistemology",
          "Logos",
          "Rationality",
          "Faith",
          "Religious belief"
        ]
      },
      {
        id: "59e671e5-28eb-4708-8ca6-3cd8179a4bbe",
        text: "When facing challenges or exploring the unknown, do you value human independence and innovation, or do you place more importance on faith, patience, and acceptance? Why?",
        concepts: [
          "Ethics",
          "Human nature",
          "Free will"
        ]
      }
    ],
    during: [],
    reflection: [
      {
        id: "b65d76d5-812b-4f68-b864-1e36b1810fe8",
        text: "Explain the difference between one-world and two-world ontological positions in philosophy. Identify which philosophical concepts (such as ethics, epistemology, etc.) are influenced by these positions, and how a philosopher's stance on this fundamental question shapes their overall philosophical system.",
        type: "mastery",
        concepts: []
      },
      {
        id: "3dc3ee8c-bd99-47d7-819b-da3b79ba0444",
        text: "Compare and contrast the \"Athens\" and \"Jerusalem\" traditions in Western philosophy. Describe how each tradition approaches the concept of logos, their characteristic virtues, and provide an example of how these traditions might differ in their approach to a philosophical question (such as \"What is the good life?\").",
        type: "mastery",
        concepts: []
      },
      {
        id: "0e9fdd79-cc32-48a3-94b2-5714c7f43a6f",
        text: "Choose three philosophical terms introduced in this lecture (such as epistemology, ontology, metaphysics, etc.) and explain how they relate to one another. Then, describe how a specific philosophical problem might be approached using these concepts.",
        type: "mastery",
        concepts: []
      },
      {
        id: "c50748b9-ebbb-4fd2-b49d-e29c824f08d8",
        text: "What aspects of philosophy discussed in this lecture remind you of ideas or questions you've encountered in your own life? How have you approached these questions before learning these formal concepts? How do the philosophical divisions (Athens vs. Jerusalem, one-world vs. two-world) compare to divisions or tensions you've observed in contemporary society or in your personal thinking? Which philosophical concept from the lecture surprised you the most, and why? What preconceptions did you have that might have been challenged? Why do you think these fundamental philosophical questions have persisted for thousands of years? What makes them continually relevant to human experience? In what ways do you see the influence of both the \"Athens\" and \"Jerusalem\" traditions in modern education, science, art, or politics? How do these different approaches coexist today? Which of the philosophical areas mentioned (epistemology, ethics, metaphysics, etc.) are you most curious to explore further, and why does it particularly interest you?",
        type: "initial",
        concepts: []
      }
    ],
    aiDiscussion: {
      understanding: "You are a philosophy education assistant evaluating my understanding of an introductory philosophy lecture. Please assess my answers on the following criteria and provide a pass/fail recommendation:\n\nConceptual Understanding: Have I correctly explained the one-world vs. two-world ontological positions and the Athens vs. Jerusalem traditions? Have I demonstrated a clear understanding of how they differ and why these distinctions matter?\nConcept Relationships: Have I accurately described three philosophical concepts from the lecture and shown how they relate to each other in a meaningful way?\nDepth of Analysis: Have I gone beyond simple definitions to demonstrate an understanding of how these philosophical frameworks shape different approaches to knowledge and human experience?\n\nIf my understanding is insufficient in any area, please:\n\nIdentify specific misunderstandings or gaps in my knowledge\nAsk 2-3 probing questions that would help clarify my understanding\nSuggest which concepts I should revisit before moving to the next lecture\n\nIf my understanding is sufficient, please:\n\nHighlight the strengths of my analysis\nSuggest one area where I could deepen my understanding further\nConfirm I'm ready to proceed to the next lecture",
      exploration: "Explain the difference between one-world and two-world ontological positions in Western philosophy. Why is this distinction important for understanding different philosophical traditions?\n\nCompare and contrast the \"Athens\" and \"Jerusalem\" traditions. How do they differ in their approach to knowledge (logos) and their view of human virtue?\n\nChoose three philosophical concepts introduced in this lecture (such as epistemology, ontology, metaphysics, ethics, etc.) and explain how they relate to each other and to the broader study of philosophy."
    }
  },
  concepts: [
    {
      id: "metaphysics",
      name: "Metaphysics",
      relatedConcepts: [],
      lectures: [
        "intro-philosophy-problems-and-scope"
      ]
    },
    {
      id: "ontology",
      name: "Ontology",
      relatedConcepts: [],
      lectures: [
        "intro-philosophy-problems-and-scope"
      ]
    }
  ]
};

export default introPhilosophyProblemsAndScopeLecture;
