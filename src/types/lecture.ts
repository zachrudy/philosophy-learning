// src/types/lecture.ts

interface Reading {
  title: string;
  author?: string;
  focus?: string;
  passages?: string[];
  chapters?: string[];
}

interface Question {
  id: string;
  text: string;
  concepts: string[];  // Links to fundamental concepts being checked
  prerequisites?: string[];  // Specific prerequisites this tests
}

interface WatchPoint {
  timestamp: string;
  focus: string;
  prompt: string;
  concepts: string[];  // Concepts being introduced/discussed
}

interface ReflectionPrompt {
  id: string;
  text: string;
  type: 'initial' | 'mastery';
  concepts: string[];  // Concepts being reflected on
}

interface ConceptNode {
  id: string;
  name: string;
  relatedConcepts: {
    conceptId: string;
    relationship: 'builds_on' | 'contrasts_with' | 'similar_to';
  }[];
  lectures: string[];  // Lecture IDs where this concept appears
}

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  prerequisites: string[];  // Lecture IDs
  readingMaterials: {
    required: Reading[];
    supplementary: Reading[];
    biblePassages?: string[];
  };
  prompts: {
    readiness: Question[];
    during: WatchPoint[];
    reflection: ReflectionPrompt[];
    aiDiscussion: {
      understanding: string;
      exploration: string;
    };
  };
  concepts: ConceptNode[];  // For concept mapping
}

interface Takeaway {
  id: string;
  type: 'connection' | 'contrast' | 'importance';
  text: string;
  relatedConcepts: string[];
  date: Date;
}

// Interface for mastery reflection attempts
interface MasteryReflectionAttempt {
  id: string;
  text: string;
  date: Date;
  feedback?: string;
  status: 'pending' | 'failed' | 'passed';
}

interface LectureProgress {
  lectureId: string;
  status: 'unwatched' | 'preliminary' | 'ready-to-watch' | 'reflected' | 'mastered' | 'needs-review' | 'remastered';
  statusHistory: {
    status: string;
    date: Date;
  }[];
  readinessChecks: {
    date: Date;
    passed: boolean;
    failedConcepts: string[];
    responses: Record<string, string>;
  }[];
  reflections: {
    initial: string;
    mastery: string[];
  };
}

export type {
  Reading,
  Question,
  WatchPoint,
  ReflectionPrompt,
  ConceptNode,
  Lecture,
  Takeaway,
  MasteryReflectionAttempt,
  LectureProgress
};
