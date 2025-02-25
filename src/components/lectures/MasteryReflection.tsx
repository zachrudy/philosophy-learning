// src/components/lectures/MasteryReflection.tsx
import React, { useState, useEffect } from 'react';
import type { Lecture } from '../../types/lecture';

interface MasteryReflectionProps {
  lecture: Lecture;
  onComplete: (reflection: string) => void;
}

interface ReflectionAttempt {
  id: string;
  text: string;
  date: Date;
  feedback?: string;
  status: 'pending' | 'failed' | 'passed';
}

const MasteryReflection: React.FC<MasteryReflectionProps> = ({ lecture, onComplete }) => {
  const [newReflection, setNewReflection] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [canSubmitNew, setCanSubmitNew] = useState(true);
  const [reflectionHistory, setReflectionHistory] = useState<ReflectionAttempt[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPromptCopied, setAiPromptCopied] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  // Load saved reflections
  useEffect(() => {
    const loadReflections = () => {
      const savedReflections = localStorage.getItem(`mastery-reflections-${lecture.id}`);
      if (savedReflections) {
        try {
          const parsed = JSON.parse(savedReflections);
          // Convert string dates back to Date objects
          const reflections = parsed.map((r: any) => ({
            ...r,
            date: new Date(r.date)
          }));
          setReflectionHistory(reflections);

          // Check if we can submit a new reflection (24 hour rule)
          const lastSubmission = reflections[reflections.length - 1];
          if (lastSubmission) {
            const hoursSinceLastSubmission = (Date.now() - new Date(lastSubmission.date).getTime()) / (1000 * 60 * 60);
            setCanSubmitNew(hoursSinceLastSubmission >= 24);
          }
        } catch (e) {
          console.error("Error loading mastery reflections", e);
        }
      }

      // Set the AI mastery prompt
      const prompt = lecture.prompts.aiDiscussion.understanding;
      setAiPrompt(prompt);
    };

    loadReflections();
  }, [lecture.id, lecture.prompts.aiDiscussion.understanding]);

  // Function to count words accurately
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNewReflection(text);
    setWordCount(countWords(text));
  };

  const handleSubmit = () => {
    if (wordCount < 150) {
      alert('Please write at least 150 words for a meaningful mastery reflection.');
      return;
    }

    // Create a new reflection attempt
    const newAttempt: ReflectionAttempt = {
      id: Date.now().toString(),
      text: newReflection,
      date: new Date(),
      status: 'pending'
    };

    // Add to history
    const updatedHistory = [...reflectionHistory, newAttempt];
    setReflectionHistory(updatedHistory);

    // Save to localStorage
    try {
      localStorage.setItem(`mastery-reflections-${lecture.id}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error saving mastery reflection", e);
    }

    // Reset form and show AI prompt
    setSubmitted(true);
    setShowAIPrompt(true);
    setSelectedReflection(newAttempt.id);
    setNewReflection('');
    setWordCount(0);
    setCanSubmitNew(false);

    // Complete the process
    onComplete(newAttempt.text);
  };

  const handleFeedbackSave = (reflectionId: string) => {
    if (!aiFeedback.trim()) {
      alert('Please enter the AI feedback before saving.');
      return;
    }

    // Update the reflection with feedback
    const updatedHistory = reflectionHistory.map(reflection => {
      if (reflection.id === reflectionId) {
        return {
          ...reflection,
          feedback: aiFeedback,
          status: aiFeedback.toLowerCase().includes('passed') ? 'passed' : 'failed'
        };
      }
      return reflection;
    });

    setReflectionHistory(updatedHistory);

    // Save to localStorage
    try {
      localStorage.setItem(`mastery-reflections-${lecture.id}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error saving mastery reflection feedback", e);
    }

    // Reset feedback form
    setAiFeedback('');
  };

  const copyAIPrompt = () => {
    navigator.clipboard.writeText(
      `Here is my mastery reflection for the topic "${lecture.title}":\n\n${
        reflectionHistory.find(r => r.id === selectedReflection)?.text || ''
      }\n\nPlease evaluate if I've mastered the topic based on this criteria:\n${aiPrompt}\n\nPlease respond with "Passed" or "Failed" and provide feedback on any gaps in my understanding.`
    );
    setAiPromptCopied(true);
    setTimeout(() => setAiPromptCopied(false), 2000);
  };

  // Get the currently selected reflection
  const selectedReflectionData = selectedReflection
    ? reflectionHistory.find(r => r.id === selectedReflection)
    : null;

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Check if 24 hours have passed since the last submission
  const checkSubmissionTime = () => {
    if (reflectionHistory.length === 0) return true;

    const lastSubmission = reflectionHistory[reflectionHistory.length - 1];
    const hoursSinceLastSubmission = (Date.now() - new Date(lastSubmission.date).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastSubmission >= 24;
  };

  return (
    <div className="bg-gray-100 text-gray-900 rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Mastery Reflection</h2>
      <p className="text-gray-700 mb-4">
        Write a reflection that demonstrates your mastery of the key concepts from the lecture.
        After submitting, you'll receive an AI mastery prompt to evaluate your understanding.
      </p>

      {/* Reflection History */}
      {reflectionHistory.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Reflection History</h3>
          <div className="grid grid-cols-1 gap-2">
            {reflectionHistory.map((reflection) => (
              <button
                key={reflection.id}
                onClick={() => {
                  setSelectedReflection(reflection.id);
                  setShowAIPrompt(true);
                }}
                className={`text-left p-2 border rounded ${
                  selectedReflection === reflection.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${
                  reflection.status === 'passed' ? 'bg-green-50' :
                  reflection.status === 'failed' ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {formatDate(reflection.date)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-sm ${
                    reflection.status === 'passed' ? 'bg-green-200 text-green-800' :
                    reflection.status === 'failed' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {reflection.status.charAt(0).toUpperCase() + reflection.status.slice(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Reflection View */}
      {selectedReflectionData && (
        <div className="mb-6 p-4 border rounded bg-white">
          <h3 className="font-semibold mb-2">
            Reflection from {formatDate(selectedReflectionData.date)}
          </h3>
          <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap mb-4">
            {selectedReflectionData.text}
          </div>

          {/* AI Prompt and Copy Button */}
          {showAIPrompt && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">AI Mastery Prompt</h4>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2">
                <p className="mb-2">Copy this prompt and paste it to an AI assistant to evaluate your mastery:</p>
                <button
                  onClick={copyAIPrompt}
                  className={`px-3 py-1 rounded text-sm ${
                    aiPromptCopied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {aiPromptCopied ? 'Copied!' : 'Copy Prompt with Your Reflection'}
                </button>
              </div>
            </div>
          )}

          {/* AI Feedback Entry */}
          <div>
            <h4 className="font-medium mb-2">
              {selectedReflectionData.feedback ? 'AI Feedback' : 'Enter AI Feedback'}
            </h4>
            {selectedReflectionData.feedback ? (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded whitespace-pre-wrap">
                {selectedReflectionData.feedback}
              </div>
            ) : (
              <>
                <textarea
                  value={aiFeedback}
                  onChange={(e) => setAiFeedback(e.target.value)}
                  placeholder="Paste the AI's feedback here..."
                  className="w-full min-h-[100px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <button
                  onClick={() => handleFeedbackSave(selectedReflectionData.id)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Feedback
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* New Reflection Form */}
      {(!canSubmitNew && !checkSubmissionTime()) ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
          <p className="text-yellow-800">
            You need to wait 24 hours between mastery reflection submissions.
            Please come back later to submit another reflection.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Please write at least 150 words
            </span>
            <span className={`text-sm ${wordCount >= 150 ? 'text-green-600' : 'text-red-600'}`}>
              {wordCount} words
            </span>
          </div>

          <textarea
            value={newReflection}
            onChange={handleChange}
            placeholder="Write your mastery reflection here (minimum 150 words)..."
            className="w-full min-h-[200px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          />

          <button
            onClick={handleSubmit}
            disabled={wordCount < 150}
            className={`mt-4 px-4 py-2 rounded-md ${
              wordCount >= 150
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            Submit Mastery Reflection
          </button>
        </>
      )}
    </div>
  );
};

export default MasteryReflection;
