// src/hooks/useLecture.ts
import { useMemo } from 'react';
import { getLecture } from '../data/lectures';
import type { Lecture, LectureProgress } from '../types/lecture';

export function useLecture(lectureId: string) {
  const lecture = useMemo(() => getLecture(lectureId), [lectureId]);

  const loadProgress = (): LectureProgress | null => {
    const saved = localStorage.getItem(`lecture-progress-${lectureId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  };

  const progress = useMemo(() => loadProgress(), [lectureId]);

  const saveLectureProgress = (updates: Partial<LectureProgress>) => {
    const currentProgress = loadProgress();
    const now = new Date();

    const newProgress: LectureProgress = {
      lectureId,
      status: updates.status || currentProgress?.status || 'unwatched',
      statusHistory: [
        ...(currentProgress?.statusHistory || []),
        { status: updates.status || 'unwatched', date: now }
      ],
      readinessChecks: [
        ...(currentProgress?.readinessChecks || []),
        ...(updates.readinessChecks || [])
      ],
      reflections: updates.reflections || currentProgress?.reflections || {
        initial: '',
        mastery: '',
        takeaways: [],
        date: now
      }
    };

    localStorage.setItem(
      `lecture-progress-${lectureId}`,
      JSON.stringify(newProgress)
    );

    return newProgress;
  };

  const clearProgress = () => {
    localStorage.removeItem(`lecture-progress-${lectureId}`);
  };

  return {
    lecture,
    progress,
    saveLectureProgress,
    clearProgress,
  };
}
