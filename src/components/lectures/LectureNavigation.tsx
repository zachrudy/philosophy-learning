import React, { useState, useEffect } from 'react';
import type { LectureProgress } from '../../types/lecture';

interface LectureNavigationProps {
  progress: LectureProgress;
  onStepChange: (step: 'readiness' | 'watch' | 'reflection' | 'mastery') => void;
}

const LectureNavigation: React.FC<LectureNavigationProps> = ({ progress, onStepChange }) => {
  const [watched, setWatched] = useState(false);

  // Check if lecture was watched
  useEffect(() => {
    const savedWatched = localStorage.getItem(`watched-${progress.lectureId}`) === 'true';
    setWatched(savedWatched || progress.status === 'reflected' || progress.status === 'mastered');
  }, [progress.lectureId, progress.status]);

  // Helper function to determine if a step is active
  const isStepActive = (step: string): boolean => {
    switch (step) {
      case 'readiness':
        return ['preliminary', 'ready-to-watch', 'reflected', 'mastered'].includes(progress.status);
      case 'watch':
        return ['ready-to-watch', 'reflected', 'mastered'].includes(progress.status);
      case 'reflection':
        return ['reflected', 'mastered'].includes(progress.status);
      case 'mastery':
        return progress.status === 'mastered';
      default:
        return false;
    }
  };

  // Helper function to determine if a step is accessible
  const isStepAccessible = (step: string): boolean => {
    switch (step) {
      case 'readiness':
        return true; // Always accessible
      case 'watch':
        return isStepActive('readiness'); // Accessible if readiness is completed
      case 'reflection':
        return watched || progress.status === 'reflected' || progress.status === 'mastered';
      case 'mastery':
        return progress.status === 'reflected' || progress.status === 'mastered';
      default:
        return false;
    }
  };

  // Function to handle watch confirmation
  const handleWatchConfirm = () => {
    localStorage.setItem(`watched-${progress.lectureId}`, 'true');
    setWatched(true);
    onStepChange('reflection');
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Lecture Progress</h2>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <li className="flex items-center space-x-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
              isStepActive('readiness') ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {isStepActive('readiness') ? '✓' : '1'}
            </span>
            <span className={isStepActive('readiness') ? 'text-green-600 font-medium' : 'text-gray-500'}>
              Readiness
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
              isStepActive('watch') ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {watched ? '✓' : '2'}
            </span>
            <span className={watched ? 'text-green-600 font-medium' : 'text-gray-500'}>
              Watch
              {isStepActive('watch') && !watched && (
                <button
                  onClick={handleWatchConfirm}
                  className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded"
                >
                  Mark as Watched
                </button>
              )}
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
              isStepActive('reflection') ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {isStepActive('reflection') ? '✓' : '3'}
            </span>
            <span className={isStepActive('reflection') ? 'text-green-600 font-medium' : 'text-gray-500'}>
              Initial Reflection
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
              isStepActive('mastery') ? 'bg-green-500 text-white' : 'bg-gray-300'
            }`}>
              {isStepActive('mastery') ? '✓' : '4'}
            </span>
            <span className={isStepActive('mastery') ? 'text-green-600 font-medium' : 'text-gray-500'}>
              Mastery Reflection
            </span>
          </li>
        </ul>

        <div className="flex flex-wrap gap-2">
          {isStepAccessible('readiness') && (
            <button
              onClick={() => onStepChange('readiness')}
              className={`px-3 py-1 rounded-md text-sm ${
                progress.status === 'preliminary' ?
                'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Readiness
            </button>
          )}

          {isStepAccessible('watch') && (
            <button
              onClick={() => onStepChange('watch')}
              className={`px-3 py-1 rounded-md text-sm ${
                progress.status === 'ready-to-watch' ?
                'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Watch
            </button>
          )}

          {isStepAccessible('reflection') && (
            <button
              onClick={() => onStepChange('reflection')}
              className={`px-3 py-1 rounded-md text-sm ${
                progress.status === 'reflected' && progress.status !== 'mastered' ?
                'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Reflect
            </button>
          )}

          {isStepAccessible('mastery') && (
            <button
              onClick={() => onStepChange('mastery')}
              className={`px-3 py-1 rounded-md text-sm ${
                progress.status === 'mastered' ?
                'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mastery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LectureNavigation;
