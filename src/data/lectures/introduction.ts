// src/data/lectures/introduction.ts
// src/data/lectures/introduction.ts
import { Lecture } from '../../types/lecture';

const philosophyConcepts = {
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

const introductionLecture: Lecture = {
  id: "intro-philosophy-scope",
  title: "Introduction to the Problems and Scope of Philosophy",
  videoUrl: "https://www.youtube.com/watch?v=8ZoQ7wh9pSQ",
  prerequisites: [], // First lecture
  fundamentalConcepts: [
    "Philosophy as love of wisdom",
    "Distinction between physics and metaphysics",
    "Role of logic and reasoning",
    "Epistemological foundations",
    "Athens vs Jerusalem traditions"
  ],

  readingMaterials: {
    required: [
      {
        title: "The Book of Job",
        focus: "Religious faith and the problem of suffering",
        passages: ["Job 1:1-22", "Job 42:1-17"]
      }
    ],
    supplementary: [
      {
        title: "The Republic",
        author: "Plato",
        focus: "Introduction to Greek philosophical thinking",
        chapters: ["Book I"]
      }
    ],
    biblePassages: ["Job 1:1-22", "Job 42:1-17"]
  },

  prompts: {
    readiness: [
      {
        id: "q1",
        text: "What does the word 'philosophy' mean to you? How would you define it?",
        concepts: [philosophyConcepts.PHIL_BASICS],
      },
      {
        id: "q2",
        text: "Can you distinguish between questions that science can answer and those it cannot?",
        concepts: [philosophyConcepts.PHYSICS, philosophyConcepts.METAPHYSICS],
      },
      {
        id: "q3",
        text: "How do you understand the relationship between faith and reason?",
        concepts: [philosophyConcepts.ATHENS, philosophyConcepts.JERUSALEM],
      }
    ],

    during: [
      {
        timestamp: "2:30",
        focus: "Key Philosophical Terms",
        prompt: "Note how each branch of philosophy is defined and its scope",
        concepts: [
          philosophyConcepts.PHYSICS,
          philosophyConcepts.METAPHYSICS,
          philosophyConcepts.EPISTEMOLOGY
        ]
      },
      {
        timestamp: "15:45",
        focus: "The Two World Views",
        prompt: "Compare the naturalistic and metaphysical perspectives",
        concepts: [philosophyConcepts.PHYSICS, philosophyConcepts.METAPHYSICS]
      },
      {
        timestamp: "25:00",
        focus: "Athens vs Jerusalem",
        prompt: "Note the key characteristics of each tradition",
        concepts: [philosophyConcepts.ATHENS, philosophyConcepts.JERUSALEM]
      }
    ],

    reflection: [
      {
        id: "r1",
        text: "How do the different branches of philosophy relate to each other?",
        type: "initial",
        concepts: [
          philosophyConcepts.PHIL_BASICS,
          philosophyConcepts.EPISTEMOLOGY,
          philosophyConcepts.LOGIC
        ]
      },
      {
        id: "r2",
        text: "Compare and contrast the approaches of Athens and Jerusalem to knowledge",
        type: "mastery",
        concepts: [philosophyConcepts.ATHENS, philosophyConcepts.JERUSALEM]
      }
    ],

    aiDiscussion: {
      understanding: "Explain how the different branches of philosophy interact and overlap",
      exploration: "How might the tension between Athens and Jerusalem help us understand modern debates?"
    }
  },

  concepts: [
    {
      id: philosophyConcepts.PHIL_BASICS,
      name: "Philosophy Fundamentals",
      relatedConcepts: [
        {
          conceptId: philosophyConcepts.LOGIC,
          relationship: "builds_on"
        },
        {
          conceptId: philosophyConcepts.EPISTEMOLOGY,
          relationship: "builds_on"
        }
      ],
      lectures: ["intro-philosophy-scope"]
    },
    {
      id: philosophyConcepts.ATHENS,
      name: "Athenian Tradition",
      relatedConcepts: [
        {
          conceptId: philosophyConcepts.JERUSALEM,
          relationship: "contrasts_with"
        }
      ],
      lectures: ["intro-philosophy-scope"]
    },
    {
      id: philosophyConcepts.JERUSALEM,
      name: "Jerusalem Tradition",
      relatedConcepts: [
        {
          conceptId: philosophyConcepts.ATHENS,
          relationship: "contrasts_with"
        }
      ],
      lectures: ["intro-philosophy-scope"]
    }
  ]
};

export default introductionLecture;
