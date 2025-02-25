// src/components/admin/tabs/ReadinessQuestionsTab.tsx
import React from 'react';

const ReadinessQuestionsTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Readiness Questions</h2>

      <div className="border p-3 rounded bg-white mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <textarea
            value={form.newReadinessQuestion.text}
            onChange={(e) => form.setNewReadinessQuestion({...form.newReadinessQuestion, text: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            placeholder="What does the word 'philosophy' mean to you? How would you define it?"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question ID
          </label>
          <input
            type="text"
            value={form.newReadinessQuestion.id}
            onChange={(e) => form.setNewReadinessQuestion({...form.newReadinessQuestion, id: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="q1 (will be auto-generated if empty)"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Concepts (comma separated)
          </label>
          <input
            type="text"
            value={form.newReadinessQuestion.concepts.join(', ')}
            onChange={(e) => {
              const concepts = e.target.value ? e.target.value.split(',').map((c: string) => c.trim()) : [];
              form.setNewReadinessQuestion({...form.newReadinessQuestion, concepts});
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="philosophy-basics, metaphysics"
          />
        </div>

        <button
          type="button"
          onClick={() => form.handleAddReadinessQuestion(form.newReadinessQuestion)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>

      {form.lecture.prompts.readiness.length > 0 && (
        <div className="space-y-4">
          {form.lecture.prompts.readiness.map((question: any, index: number) => (
            <div key={index} className="border p-3 rounded bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => form.handleRemoveReadinessQuestion(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={question.text}
                  onChange={(e) => form.handleReadinessQuestionChange(index, 'text', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question ID
                </label>
                <input
                  type="text"
                  value={question.id}
                  onChange={(e) => form.handleReadinessQuestionChange(index, 'id', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Concepts (comma separated)
                </label>
                <input
                  type="text"
                  value={question.concepts.join(', ')}
                  onChange={(e) => form.handleReadinessQuestionChange(index, 'concepts', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadinessQuestionsTab;
