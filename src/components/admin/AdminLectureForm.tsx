// src/components/admin/AdminLectureForm.tsx
import React from 'react';
import useLectureForm, { LectureCategory } from '../../hooks/useLectureForm';
import type { Lecture } from '../../types/lecture';
import {
  BasicInfoTab,
  ReadingMaterialsTab,
  ReadinessQuestionsTab,
  WatchPointsTab,
  ReflectionPromptsTab,
  AIDiscussionTab,
  ConceptsTab
} from './tabs';

interface AdminLectureFormProps {
  onSave?: (lecture: Lecture, category: LectureCategory) => void;
  initialLecture?: Lecture;
  initialCategory?: LectureCategory;
}

const AdminLectureForm: React.FC<AdminLectureFormProps> = ({
  onSave,
  initialLecture,
  initialCategory
}) => {
  const form = useLectureForm({
    initialLecture,
    initialCategory,
    onSave
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit(e);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">Admin Lecture Form</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => form.setPreviewMode(!form.previewMode)}
            className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
          >
            {form.previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
      </div>

      {form.saveMessage && (
        <div className={`p-3 rounded mb-4 ${form.saveMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {form.saveMessage}
        </div>
      )}

      {form.previewMode ? (
        <div className="bg-gray-100 p-4 rounded overflow-auto">
          <h2 className="text-lg font-bold mb-2">Preview:</h2>
          <pre className="text-sm">{JSON.stringify(form.lecture, null, 2)}</pre>
          <h3 className="text-lg font-bold mt-4 mb-2">TypeScript Code:</h3>
          <pre className="text-sm">{form.generateTypeScriptCode(form.lecture, form.category)}</pre>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit}>
          {/* Tabs for different sections - reordered to put Concepts right after Basic Info */}
          <div className="mb-4 flex flex-wrap space-x-1 border-b">
            <button
              type="button"
              onClick={() => form.setActiveTab('basic')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('concepts')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'concepts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Concepts
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('readings')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'readings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Reading Materials
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('readiness')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'readiness' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Readiness Questions
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('watch')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'watch' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Watch Points
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('reflection')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'reflection' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Reflection Prompts
            </button>
            <button
              type="button"
              onClick={() => form.setActiveTab('ai')}
              className={`px-3 py-2 rounded-t-lg text-sm ${form.activeTab === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              AI Discussion
            </button>
          </div>

          {/* Tab Content */}
          {form.activeTab === 'basic' && <BasicInfoTab form={form} />}
          {form.activeTab === 'concepts' && <ConceptsTab form={form} />}
          {form.activeTab === 'readings' && <ReadingMaterialsTab form={form} />}
          {form.activeTab === 'readiness' && <ReadinessQuestionsTab form={form} />}
          {form.activeTab === 'watch' && <WatchPointsTab form={form} />}
          {form.activeTab === 'reflection' && <ReflectionPromptsTab form={form} />}
          {form.activeTab === 'ai' && <AIDiscussionTab form={form} />}

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Save Lecture
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminLectureForm;
