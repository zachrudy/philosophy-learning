// src/data/lectures/index.ts
import introductionLecture from './introduction';
import type { Lecture } from '../../types/lecture';

// Map of lecture IDs to lecture objects
const lectures: Record<string, Lecture> = {
  [introductionLecture.id]: introductionLecture,
  // Add more lectures here as they are created
};

// Get a specific lecture by ID
export function getLecture(id: string): Lecture {
  const lecture = lectures[id];
  if (!lecture) {
    throw new Error(`Lecture with ID "${id}" not found`);
  }
  return lecture;
}

// Get all lectures
export function getAllLectures(): Lecture[] {
  return Object.values(lectures);
}

// Get lectures in a recommended order (based on prerequisites)
export function getLecturesInOrder(): Lecture[] {
  const allLectures = getAllLectures();

  // Simple topological sort based on prerequisites
  const sorted: Lecture[] = [];
  const visited = new Set<string>();

  function visit(lecture: Lecture) {
    if (visited.has(lecture.id)) return;
    visited.add(lecture.id);

    // First visit all prerequisites
    for (const prereqId of lecture.prerequisites) {
      const prereq = lectures[prereqId];
      if (prereq) visit(prereq);
    }

    sorted.push(lecture);
  }

  // Visit all lectures
  for (const lecture of allLectures) {
    visit(lecture);
  }

  return sorted;
}
