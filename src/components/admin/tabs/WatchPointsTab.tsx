// src/components/admin/tabs/WatchPointsTab.tsx
import React from 'react';

const WatchPointsTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Watch Points</h2>

      <div className="border p-3 rounded bg-white mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timestamp *
          </label>
          <input
            type="text"
            value={form.newWatchPoint.timestamp}
            onChange={(e) => form.setNewWatchPoint({...form.newWatchPoint, timestamp: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2:30"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Focus *
          </label>
          <input
            type="text"
            value={form.newWatchPoint.focus}
            onChange={(e) => form.setNewWatchPoint({...form.newWatchPoint, focus: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Key Philosophical Terms"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prompt *
          </label>
          <textarea
            value={form.newWatchPoint.prompt}
            onChange={(e) => form.setNewWatchPoint({...form.newWatchPoint, prompt: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            placeholder="Note how each branch of philosophy is defined and its scope"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Concepts (comma separated)
          </label>
          <input
            type="text"
            value={form.newWatchPoint.concepts.join(', ')}
            onChange={(e) => {
              const concepts = e.target.value ? e.target.value.split(',').map((c: string) => c.trim()) : [];
              form.setNewWatchPoint({...form.newWatchPoint, concepts});
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="physics-nature, metaphysics, epistemology"
          />
        </div>

        <button
          type="button"
          onClick={() => form.handleAddWatchPoint(form.newWatchPoint)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Watch Point
        </button>
      </div>

      {form.lecture.prompts.during.length > 0 && (
        <div className="space-y-4">
          {form.lecture.prompts.during.map((watchPoint: any, index: number) => (
            <div key={index} className="border p-3 rounded bg-white">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Watch Point {index + 1} ({watchPoint.timestamp})</h4>
                <button
                  type="button"
                  onClick={() => form.handleRemoveWatchPoint(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timestamp
                </label>
                <input
                  type="text"
                  value={watchPoint.timestamp}
                  onChange={(e) => form.handleWatchPointChange(index, 'timestamp', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Focus
                </label>
                <input
                  type="text"
                  value={watchPoint.focus}
                  onChange={(e) => form.handleWatchPointChange(index, 'focus', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt
                </label>
                <textarea
                  value={watchPoint.prompt}
                  onChange={(e) => form.handleWatchPointChange(index, 'prompt', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                />
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Concepts (comma separated)
                </label>
                <input
                  type="text"
                  value={watchPoint.concepts.join(', ')}
                  onChange={(e) => form.handleWatchPointChange(index, 'concepts', e.target.value)}
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

export default WatchPointsTab;
