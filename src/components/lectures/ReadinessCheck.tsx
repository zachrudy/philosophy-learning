// src/components/lectures/ReadinessCheck.tsx
import React, { useState, useEffect } from 'react';
import type { Lecture } from '../../types/lecture';

interface ReadinessCheckProps {
  lecture: Lecture;
  onComplete: (result: {
    passed: boolean;
    failedConcepts: string[];
    responses: Record<string, string>;
    date: Date;
  }) => void;
  onMarkReady?: (status: string) => void;
}

const ReadinessCheck: React.FC<ReadinessCheckProps> = ({ lecture, onComplete, onMarkReady = () => {} }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showGuidance, setShowGuidance] = useState(false);
  const [status, setStatus] = useState<string>('');

  const questions = lecture.prompts.readiness;
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const savedResponses = localStorage.getItem(`readiness-${lecture.id}`);
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, [lecture.id]);

  const handleResponseChange = (response: string) => {
    const newResponses = {
      ...responses,
      [currentQuestion.id]: response
    };
    setResponses(newResponses);
    localStorage.setItem(`readiness-${lecture.id}`, JSON.stringify(newResponses));
  };

  const isResponseValid = (response: string) => {
    return response.trim().split(/\s+/).length >= 30;
  };

  const allQuestionsAnswered = questions.every(q => isResponseValid(responses[q.id] || ''));

  const evaluateReadiness = () => {
    const failedConcepts: string[] = [];
    let passed = true;

    questions.forEach(question => {
      const response = responses[question.id];
      if (!response || !isResponseValid(response)) {
        passed = false;
        failedConcepts.push(...question.concepts);
      }
    });

    return {
      passed,
      failedConcepts: [...new Set(failedConcepts)],
      responses,
      date: new Date()
    };
  };

  const handleComplete = () => {
    if (currentQuestionIndex < questions.length - 1) return;

    const result = evaluateReadiness();
    onComplete(result);

    if (!allQuestionsAnswered) {
      setStatus('Must answer all prompts before proceeding.');
      onMarkReady('Must answer all prompts before proceeding.');
    } else {
      setStatus(''); // Clear status initially
      setTimeout(() => {
        if (lecture.prerequisites.length === 0) {
          setStatus('Ready for Lecture');
          onMarkReady('Ready for Lecture');
        } else if (result.failedConcepts.length > 0) {
          const prereqNames = lecture.prerequisites.join(', ');
          const message = `Needs to master lecture(s): ${prereqNames}`;
          setStatus(message);
          onMarkReady(message);
        } else {
          setStatus('Preliminary');
          onMarkReady('Preliminary');
        }
      }, 100); // Small delay to ensure UI updates correctly
    }
  };

  const handleNext = () => {
    if (isResponseValid(responses[currentQuestion.id] || '')) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      alert('Please write at least 30 words before proceeding.');
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Readiness Check</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">{currentQuestion.text}</h3>
          <div className="flex gap-2 flex-wrap">
            {currentQuestion.concepts.map(concept => (
              <span
                key={concept}
                className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        <textarea
          value={responses[currentQuestion.id] || ''}
          onChange={(e) => handleResponseChange(e.target.value)}
          placeholder="Take time to reflect deeply (minimum 30 words)..."
          className="w-full min-h-[150px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        />

        <div className="flex justify-between items-center pt-4">
          <button
            onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border bg-white text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Submit Readiness Check
            </button>
          )}
        </div>
      </div>

      {status && <p className="mt-4 text-green-700 font-semibold">{status}</p>}
    </div>
  );
};

export default ReadinessCheck;
