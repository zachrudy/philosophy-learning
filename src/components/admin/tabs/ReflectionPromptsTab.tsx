// src/components/admin/tabs/ReflectionPromptsTab.tsx
import React from 'react';

const ReflectionPromptsTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Reflection Prompts</h2>

      <div className="border p-3 rounded bg-white mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt Text *
          </label>
          <textarea
            value={form.newReflectionPrompt.text}
            onChange={(e) => form.setNewReflectionPrompt({...form.newReflectionPrompt, text: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            placeholder="How do the different branches of philosophy relate to each other?"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt ID
          </label>
          <input
            type="text"
            value={form.newReflectionPrompt.id}
            onChange={(e) => form.setNewReflectionPrompt({...form.newReflectionPrompt, id: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="r1 (will be auto-generated if empty)"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={form.newReflectionPrompt.type}
            onChange={(e) => form.setNewReflectionPrompt({
              ...form.newReflectionPrompt,
              type: e.target.value as 'initial' | 'mastery'
            })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="initial">Initial Reflection</option>
            <option value="mastery">Mastery Reflection</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Concepts (comma separated)
          </label>
          <input
            type="text"
            value={form.newReflectionPrompt.concepts.join(', ')}
            onChange={(e) => {
              const concepts = e.target.value ? e.target.value.split(',').map((c: string) => c.trim()) : [];
              form.setNewReflectionPrompt({...form.newReflectionPrompt, concepts});
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="philosophy-basics, epistemology, logic"
          />
        </div>

        <button
          type="button"
          onClick={() => form.handleAddReflectionPrompt(form.newReflectionPrompt)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Reflection Prompt
        </button>
      </div>

      {form.lecture.prompts.reflection.length > 0 && (
        <div className="space-y-4">
          {form.lecture.prompts.reflection.map((prompt: any, index: number) => (
            <div key={index} className="border p-3 rounded bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">
                  {prompt.type === 'initial' ? 'Initial' : 'Mastery'} Reflection Prompt {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => form.handleRemoveReflectionPrompt(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt Text
                </label>
                <textarea
                  value={prompt.text}
                  onChange={(e) => form.handleReflectionPromptChange(index, 'text', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt ID
                </label>
                <input
                  type="text"
                  value={prompt.id}
                  onChange={(e) => form.handleReflectionPromptChange(index, 'id', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={prompt.type}
                  onChange={(e) => form.handleReflectionPromptChange(
                    index,
                    'type',
                    e.target.value as 'initial' | 'mastery'
                  )}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="initial">Initial Reflection</option>
                  <option value="mastery">Mastery Reflection</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Concepts (comma separated)
                </label>
                <input
                  type="text"
                  value={prompt.concepts.join(', ')}
                  onChange={(e) => form.handleReflectionPromptChange(index, 'concepts', e.target.value)}
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

export default ReflectionPromptsTab;
