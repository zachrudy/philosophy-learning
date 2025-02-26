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
  promptIds: string[]; // Store which prompts were addressed
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
  const [selectedPrompts, setSelectedPrompts] = useState<Record<string, boolean>>({});

  // Get all mastery prompts from the lecture
  const getMasteryPrompts = () => {
    return lecture.prompts.reflection.filter(p => p.type === 'mastery');
  };

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
            date: new Date(r.date),
            // Ensure promptIds exists
            promptIds: r.promptIds || []
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

      // Initialize selected prompts object
      const initialSelectedPrompts: Record<string, boolean> = {};
      getMasteryPrompts().forEach(p => {
        initialSelectedPrompts[p.id] = false;
      });
      setSelectedPrompts(initialSelectedPrompts);
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

  const handlePromptCheckboxChange = (promptId: string, checked: boolean) => {
    setSelectedPrompts(prev => ({
      ...prev,
      [promptId]: checked
    }));
  };

  const getSelectedPromptIds = () => {
    return Object.entries(selectedPrompts)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
  };

  const areAnyPromptsSelected = () => {
    return getSelectedPromptIds().length > 0;
  };

  const handleSubmit = () => {
    if (wordCount < 150) {
      alert('Please write at least 150 words for a meaningful mastery reflection.');
      return;
    }

    if (!areAnyPromptsSelected()) {
      alert('Please select at least one reflection prompt that you addressed in your response.');
      return;
    }

    const selectedPromptIds = getSelectedPromptIds();

    // Create a new reflection attempt
    const newAttempt: ReflectionAttempt = {
      id: Date.now().toString(),
      text: newReflection,
      date: new Date(),
      status: 'pending',
      promptIds: selectedPromptIds
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

    // Reset selected prompts
    const resetSelectedPrompts: Record<string, boolean> = {};
    getMasteryPrompts().forEach(p => {
      resetSelectedPrompts[p.id] = false;
    });
    setSelectedPrompts(resetSelectedPrompts);

    // Complete the process
    onComplete(newAttempt.text);
  };

  const handleFeedbackSave = (reflectionId: string) => {
    if (!aiFeedback.trim()) {
      alert('Please enter the AI feedback before saving.');
      return;
    }

    // Parse status from feedback
    let status: 'passed' | 'failed' = 'pending';

    // Update the reflection with feedback
    const updatedHistory = reflectionHistory.map(reflection => {
      if (reflection.id === reflectionId) {
        return {
          ...reflection,
          feedback: aiFeedback,
          status: status
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

  const handleSetStatus = (reflectionId: string, status: 'passed' | 'failed') => {
    // Update the reflection status
    const updatedHistory = reflectionHistory.map(reflection => {
      if (reflection.id === reflectionId) {
        return {
          ...reflection,
          status: status
        };
      }
      return reflection;
    });

    setReflectionHistory(updatedHistory);

    // Save to localStorage
    try {
      localStorage.setItem(`mastery-reflections-${lecture.id}`, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Error saving mastery reflection status", e);
    }
  };

  const copyAIPrompt = () => {
    const reflectionData = reflectionHistory.find(r => r.id === selectedReflection);
    if (!reflectionData) return;

    // Get all the prompts that were addressed
    const promptTexts = reflectionData.promptIds.map(promptId => {
      const prompt = lecture.prompts.reflection.find(p => p.id === promptId);
      return prompt ? prompt.text : "Unknown prompt";
    });

    // Create the complete prompt text
    const promptMessage = `
=== REFLECTION PROMPT(S) ===
${promptTexts.map((text, index) => `${index + 1}. ${text}`).join('\n\n')}

=== STUDENT REFLECTION ===
${reflectionData.text}

=== EVALUATION CRITERIA ===
${aiPrompt}

Please evaluate this reflection against the criteria above and clearly state "PASSED" or "FAILED" at the beginning of your response, followed by detailed feedback.
`.trim();

    navigator.clipboard.writeText(promptMessage);
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
  // disabled for now
  const checkSubmissionTime = () => {
    if (reflectionHistory.length === 0) return true;

    const lastSubmission = reflectionHistory[reflectionHistory.length - 1];
    const hoursSinceLastSubmission = (Date.now() - new Date(lastSubmission.date).getTime()) / (1000 * 60 * 60);
    return hoursSinceLastSubmission >= -1;
  };

  // Get the prompt texts for a reflection
  const getPromptTextsForReflection = (reflection: ReflectionAttempt) => {
    return reflection.promptIds.map(promptId => {
      const prompt = lecture.prompts.reflection.find(p => p.id === promptId);
      return prompt ? prompt.text : "Unknown prompt";
    });
  };

  return (
    <div className="bg-gray-100 text-gray-900 rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Mastery Reflection</h2>
      <p className="text-gray-700 mb-4">
        Write a reflection that demonstrates your mastery of the key concepts from the lecture.
        Check off the prompts you address in your reflection.
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

          {/* Show which prompts were addressed */}
          <div className="bg-gray-100 p-3 rounded mb-3">
            <h4 className="font-medium text-sm mb-2">Prompts Addressed:</h4>
            {getPromptTextsForReflection(selectedReflectionData).map((promptText, index) => (
              <div key={index} className="mb-2 text-sm p-2 bg-white rounded border">
                {promptText}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap mb-4">
            {selectedReflectionData.text}
          </div>

          {/* AI Prompt and Copy Button */}
          {showAIPrompt && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">AI Mastery Evaluation</h4>
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2">
                <p className="mb-2">Here's the AI evaluation criteria for this lecture:</p>
                <div className="bg-white p-2 rounded border mb-3 text-sm whitespace-pre-wrap">
                  {lecture.prompts.aiDiscussion.understanding}
                </div>
                <button
                  onClick={copyAIPrompt}
                  className={`px-3 py-1 rounded text-sm ${
                    aiPromptCopied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {aiPromptCopied ? 'Copied!' : 'Copy Complete Evaluation Prompt'}
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

            {/* Pass/Fail Status Buttons */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Mark Status Based on AI Evaluation:</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSetStatus(selectedReflectionData.id, 'passed')}
                  className={`px-4 py-2 rounded ${
                    selectedReflectionData.status === 'passed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-green-100'
                  }`}
                >
                  Passed
                </button>
                <button
                  onClick={() => handleSetStatus(selectedReflectionData.id, 'failed')}
                  className={`px-4 py-2 rounded ${
                    selectedReflectionData.status === 'failed'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-red-100'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>
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
          {/* Prompt Checklist */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Mastery Reflection Prompts - Check the ones you will address:
            </h3>
            <div className="space-y-4 bg-white p-4 rounded border">
              {getMasteryPrompts().map((prompt) => (
                <div key={prompt.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`prompt-${prompt.id}`}
                    checked={selectedPrompts[prompt.id] || false}
                    onChange={(e) => handlePromptCheckboxChange(prompt.id, e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`prompt-${prompt.id}`}
                    className="ml-2 block text-gray-700"
                  >
                    {prompt.text}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
            placeholder="Write your mastery reflection here addressing the checked prompts above (minimum 150 words)..."
            className="w-full min-h-[200px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          />

          <button
            onClick={handleSubmit}
            disabled={wordCount < 150 || !areAnyPromptsSelected()}
            className={`mt-4 px-4 py-2 rounded-md ${
              wordCount >= 150 && areAnyPromptsSelected()
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
