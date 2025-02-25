// src/components/admin/tabs/ReadingMaterialsTab.tsx
import React from 'react';

const ReadingMaterialsTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Reading Materials</h2>

      {/* Required Readings */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Required Readings</h3>

        <div className="border p-3 rounded bg-white mb-2">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.newReadingRequired.title}
              onChange={(e) => form.setNewReadingRequired({...form.newReadingRequired, title: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="The Book of Job"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={form.newReadingRequired.author || ''}
              onChange={(e) => form.setNewReadingRequired({...form.newReadingRequired, author: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Author name"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus
            </label>
            <input
              type="text"
              value={form.newReadingRequired.focus || ''}
              onChange={(e) => form.setNewReadingRequired({...form.newReadingRequired, focus: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Religious faith and the problem of suffering"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passages (comma separated)
            </label>
            <input
              type="text"
              value={form.newReadingRequired.passages?.join(', ') || ''}
              onChange={(e) => {
                const passages = e.target.value ? e.target.value.split(',').map(p => p.trim()) : [];
                form.setNewReadingRequired({...form.newReadingRequired, passages});
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Job 1:1-22, Job 42:1-17"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapters (comma separated)
            </label>
            <input
              type="text"
              value={form.newReadingRequired.chapters?.join(', ') || ''}
              onChange={(e) => {
                const chapters = e.target.value ? e.target.value.split(',').map(c => c.trim()) : [];
                form.setNewReadingRequired({...form.newReadingRequired, chapters});
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Book I, Book II"
            />
          </div>

          <button
            type="button"
            onClick={() => form.handleAddReading('required', form.newReadingRequired)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Required Reading
          </button>
        </div>

        {form.lecture.readingMaterials.required.length > 0 && (
          <div className="space-y-2">
            {form.lecture.readingMaterials.required.map((reading: any, index: number) => (
              <div key={index} className="border p-3 rounded bg-white">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{reading.title}</h4>
                  <button
                    type="button"
                    onClick={() => form.handleRemoveReading('required', index)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {reading.author && <p className="text-sm mb-1"><strong>Author:</strong> {reading.author}</p>}
                {reading.focus && <p className="text-sm mb-1"><strong>Focus:</strong> {reading.focus}</p>}
                {reading.passages && reading.passages.length > 0 && (
                  <p className="text-sm mb-1"><strong>Passages:</strong> {reading.passages.join(', ')}</p>
                )}
                {reading.chapters && reading.chapters.length > 0 && (
                  <p className="text-sm mb-1"><strong>Chapters:</strong> {reading.chapters.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplementary Readings */}
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Supplementary Readings</h3>

        <div className="border p-3 rounded bg-white mb-2">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={form.newReadingSupplementary.title}
              onChange={(e) => form.setNewReadingSupplementary({...form.newReadingSupplementary, title: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="The Republic"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={form.newReadingSupplementary.author || ''}
              onChange={(e) => form.setNewReadingSupplementary({...form.newReadingSupplementary, author: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Plato"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Focus
            </label>
            <input
              type="text"
              value={form.newReadingSupplementary.focus || ''}
              onChange={(e) => form.setNewReadingSupplementary({...form.newReadingSupplementary, focus: e.target.value})}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introduction to Greek philosophical thinking"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passages (comma separated)
            </label>
            <input
              type="text"
              value={form.newReadingSupplementary.passages?.join(', ') || ''}
              onChange={(e) => {
                const passages = e.target.value ? e.target.value.split(',').map(p => p.trim()) : [];
                form.setNewReadingSupplementary({...form.newReadingSupplementary, passages});
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pages 1-22, Pages 42-50"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapters (comma separated)
            </label>
            <input
              type="text"
              value={form.newReadingSupplementary.chapters?.join(', ') || ''}
              onChange={(e) => {
                const chapters = e.target.value ? e.target.value.split(',').map(c => c.trim()) : [];
                form.setNewReadingSupplementary({...form.newReadingSupplementary, chapters});
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Book I, Book II"
            />
          </div>

          <button
            type="button"
            onClick={() => form.handleAddReading('supplementary', form.newReadingSupplementary)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Supplementary Reading
          </button>
        </div>

        {form.lecture.readingMaterials.supplementary.length > 0 && (
          <div className="space-y-2">
            {form.lecture.readingMaterials.supplementary.map((reading: any, index: number) => (
              <div key={index} className="border p-3 rounded bg-white">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{reading.title}</h4>
                  <button
                    type="button"
                    onClick={() => form.handleRemoveReading('supplementary', index)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {reading.author && <p className="text-sm mb-1"><strong>Author:</strong> {reading.author}</p>}
                {reading.focus && <p className="text-sm mb-1"><strong>Focus:</strong> {reading.focus}</p>}
                {reading.passages && reading.passages.length > 0 && (
                  <p className="text-sm mb-1"><strong>Passages:</strong> {reading.passages.join(', ')}</p>
                )}
                {reading.chapters && reading.chapters.length > 0 && (
                  <p className="text-sm mb-1"><strong>Chapters:</strong> {reading.chapters.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bible Passages */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Bible Passages</h3>

        <div className="flex mb-2">
          <input
            type="text"
            value={form.newBiblePassage}
            onChange={(e) => form.setNewBiblePassage(e.target.value)}
            className="flex-grow p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Job 1:1-22"
          />
          <button
            type="button"
            onClick={() => form.handleAddBiblePassage(form.newBiblePassage)}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {form.lecture.readingMaterials.biblePassages && form.lecture.readingMaterials.biblePassages.length > 0 && (
          <div className="space-y-2">
            {form.lecture.readingMaterials.biblePassages.map((passage: string, index: number) => (
              <div key={index} className="flex items-center bg-white p-2 rounded border">
                <span className="flex-grow">{passage}</span>
                <button
                  type="button"
                  onClick={() => form.handleRemoveBiblePassage(index)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingMaterialsTab;
