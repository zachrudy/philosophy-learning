import { useState, useEffect } from 'react';
import ReadinessCheck from './ReadinessCheck';
import InitialReflection from './InitialReflection';
import MasteryReflection from './MasteryReflection';
import LectureNavigation from './LectureNavigation';
import introduction from "../../data/lectures/introductions/intro-philosophy-problems-and-scope";
import type { LectureProgress } from '../../types/lecture';

const LectureTest = () => {
  const [progress, setProgress] = useState<LectureProgress>({
    lectureId: introduction.id,
    status: 'unwatched',
    statusHistory: [],
    readinessChecks: [],
    reflections: { initial: '', mastery: [] },
  });

  // Check for saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`lecture-progress-${introduction.id}`);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Error parsing saved progress", e);
      }
    }
  }, []);

  const handleStepChange = (step: 'readiness' | 'watch' | 'reflection' | 'mastery') => {
    let newStatus = progress.status;

    if (step === 'readiness') newStatus = 'preliminary';
    if (step === 'watch') newStatus = 'ready-to-watch';
    if (step === 'reflection') {
      newStatus = 'reflected';
      // Mark as watched
      localStorage.setItem(`watched-${introduction.id}`, 'true');
    }
    if (step === 'mastery') newStatus = 'mastered';

    const newProgress = { ...progress, status: newStatus };
    setProgress(newProgress);

    // Save to localStorage
    try {
      localStorage.setItem(`lecture-progress-${introduction.id}`, JSON.stringify(newProgress));
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  const handleReadinessComplete = (result: {
    passed: boolean;
    failedConcepts: string[];
    responses: Record<string, string>;
    date: Date;
  }) => {
    const newReadinessChecks = [...progress.readinessChecks, result];
    const newProgress = {
      ...progress,
      status: 'ready-to-watch',
      readinessChecks: newReadinessChecks
    };

    setProgress(newProgress);

    // Save to localStorage
    try {
      localStorage.setItem(`lecture-progress-${introduction.id}`, JSON.stringify(newProgress));
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  const handleInitialReflectionComplete = (reflection: string) => {
    const newProgress = {
      ...progress,
      status: 'reflected',
      reflections: {
        ...progress.reflections,
        initial: reflection
      }
    };

    setProgress(newProgress);

    // Save to localStorage
    try {
      localStorage.setItem(`lecture-progress-${introduction.id}`, JSON.stringify(newProgress));
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  const handleMasteryReflectionComplete = (reflection: string) => {
    // For mastery reflections, we don't store them directly in the progress
    // since they're saved separately in localStorage with more details
    const newProgress = {
      ...progress,
      status: 'mastered'
    };

    setProgress(newProgress);

    // Save to localStorage
    try {
      localStorage.setItem(`lecture-progress-${introduction.id}`, JSON.stringify(newProgress));
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  // Function to clear all saved data
  const handleReset = () => {
    // Clear all localStorage items related to this lecture
    localStorage.removeItem(`lecture-progress-${introduction.id}`);
    localStorage.removeItem(`readiness-${introduction.id}`);
    localStorage.removeItem(`reflection-${introduction.id}`);
    localStorage.removeItem(`watched-${introduction.id}`);
    localStorage.removeItem(`mastery-reflections-${introduction.id}`);

    // Reset progress state
    setProgress({
      lectureId: introduction.id,
      status: 'unwatched',
      statusHistory: [],
      readinessChecks: [],
      reflections: { initial: '', mastery: [] },
    });
  };

  // Determine which component to render based on the current status
  const renderContent = () => {
    switch (progress.status) {
      case 'unwatched':
      case 'preliminary':
        return (
          <ReadinessCheck
            lecture={introduction}
            onComplete={handleReadinessComplete}
            onMarkReady={() => {}} // Empty function as we're handling this via onComplete
          />
        );
      case 'ready-to-watch':
        return (
          <div className="bg-white p-6 rounded-lg shadow my-4">
            <h2 className="text-xl font-bold mb-4">Watch the Lecture</h2>
            <p className="mb-4">
              Please watch the lecture at: {" "}
              <a
                href={introduction.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {introduction.title}
              </a>
            </p>

            <div className="mt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => handleStepChange('reflection')}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">I confirm that I've watched the lecture</span>
              </label>
            </div>
          </div>
        );
      case 'reflected':
        return (
          <div>
            <InitialReflection
              lecture={introduction}
              onComplete={handleInitialReflectionComplete}
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => handleStepChange('mastery')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue to Mastery Reflection
              </button>
            </div>
          </div>
        );
      case 'mastered':
        return (
          <MasteryReflection
            lecture={introduction}
            onComplete={handleMasteryReflectionComplete}
          />
        );
      default:
        // Fallback - show the readiness check
        return (
          <ReadinessCheck
            lecture={introduction}
            onComplete={handleReadinessComplete}
            onMarkReady={() => {}}
          />
        );
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">{introduction.title}</h1>
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
        >
          Reset Progress
        </button>
      </div>
      <LectureNavigation progress={progress} onStepChange={handleStepChange} />
      {renderContent()}
    </div>
  );
};

export default LectureTest;
