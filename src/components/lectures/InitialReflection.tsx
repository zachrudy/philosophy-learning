// src/components/lectures/InitialReflection.tsx
import React, { useState, useEffect } from 'react';
import type { Lecture } from '../../types/lecture';

interface InitialReflectionProps {
  lecture: Lecture;
  onComplete: (reflection: string) => void;
}

const InitialReflection: React.FC<InitialReflectionProps> = ({ lecture, onComplete }) => {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const savedReflection = localStorage.getItem(`reflection-${lecture.id}`);
    if (savedReflection) {
      setReflection(savedReflection);
      setWordCount(countWords(savedReflection));
      setSubmitted(true);
    }
  }, [lecture.id]);

  // Function to count words more accurately
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setReflection(newText);
    setWordCount(countWords(newText));
  };

  const handleSubmit = () => {
    if (wordCount < 50) {
      alert('Please write at least 50 words for a meaningful reflection.');
      return;
    }
    localStorage.setItem(`reflection-${lecture.id}`, reflection);
    setSubmitted(true);
    onComplete(reflection);
  };

  return (
    <div className="bg-gray-100 text-gray-900 rounded-lg shadow p-6 max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Initial Reflection</h2>
      <p className="text-gray-700 mb-4">Take some time to reflect on the key ideas from the lecture.</p>

      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Please write at least 50 words
        </span>
        <span className={`text-sm ${wordCount >= 50 ? 'text-green-600' : 'text-red-600'}`}>
          {wordCount} words
        </span>
      </div>

      <textarea
        value={reflection}
        onChange={handleChange}
        placeholder="Write your reflection here (minimum 50 words)..."
        className="w-full min-h-[150px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        disabled={submitted}
      />

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={wordCount < 50}
          className={`mt-4 px-4 py-2 rounded-md ${
            wordCount >= 50
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          Submit Reflection
        </button>
      ) : (
        <p className="mt-4 text-green-700 font-semibold">Reflection submitted!</p>
      )}
    </div>
  );
};

export default InitialReflection;
