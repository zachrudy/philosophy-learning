// src/components/admin/tabs/BasicInfoTab.tsx
import React from 'react';
import { LECTURE_CATEGORIES } from '../../../hooks/useLectureForm';

const BasicInfoTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Basic Information</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={form.handleCategoryChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {LECTURE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lecture ID *
        </label>
        <input
          type="text"
          name="id"
          value={form.lecture.id}
          onChange={form.handleBasicInfoChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="unique-lecture-id"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Use kebab-case (e.g., intro-philosophy-scope)
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={form.lecture.title}
          onChange={form.handleBasicInfoChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Introduction to Philosophy"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video URL *
        </label>
        <input
          type="url"
          name="videoUrl"
          value={form.lecture.videoUrl}
          onChange={form.handleBasicInfoChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </div>

      {/* Prerequisites */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prerequisites
        </label>
        <div className="flex">
          <select
            value={form.newPrerequisite}
            onChange={(e) => form.setNewPrerequisite(e.target.value)}
            className="flex-grow p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select prerequisite lecture</option>
            {form.existingLectures.map((lect: {id: string, title: string}) => (
              <option key={lect.id} value={lect.id}>
                {lect.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => form.handleAddArrayItem('prerequisites', form.newPrerequisite)}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {form.lecture.prerequisites.length > 0 && (
          <div className="mt-2 space-y-2">
            {form.lecture.prerequisites.map((prereq: string, index: number) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => form.handleArrayItemChange('prerequisites', index, e.target.value)}
                  className="flex-grow p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => form.handleRemoveArrayItem('prerequisites', index)}
                  className="px-2 py-2 bg-red-600 text-white rounded-r hover:bg-red-700"
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

export default BasicInfoTab;
