// src/components/admin/AdminContainer.tsx
import React, { useState, useEffect } from 'react';
import AdminLectureForm from './AdminLectureForm';
import type { Lecture } from '../../types/lecture';
import { LectureCategory } from '../../hooks/useLectureForm';

const AdminContainer: React.FC = () => {
  const [savedLectures, setSavedLectures] = useState<Array<{
    id: string;
    title: string;
    category: LectureCategory;
    lastModified: Date;
  }>>([]);
  const [selectedLecture, setSelectedLecture] = useState<{lecture: Lecture, category: LectureCategory} | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load saved lectures on component mount
  useEffect(() => {
    const loadSavedLectures = () => {
      try {
        const lecturesList: Array<{
          id: string;
          title: string;
          category: LectureCategory;
          lastModified: Date;
        }> = [];

        // Loop through all localStorage keys to find lectures
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('lecture-data-')) {
            try {
              const category = key.split('lecture-data-')[1].split('-')[0] as LectureCategory;
              const lectureData = JSON.parse(localStorage.getItem(key) || "");

              if (lectureData.id && lectureData.title) {
                lecturesList.push({
                  id: lectureData.id,
                  title: lectureData.title,
                  category,
                  lastModified: new Date() // No timestamp stored, using current time
                });
              }
            } catch (e) {
              console.error("Error parsing lecture data", e);
            }
          }
        }

        setSavedLectures(lecturesList);
      } catch (e) {
        console.error("Error loading existing lectures", e);
      }
    };

    loadSavedLectures();
  }, [showForm]); // Reload when showForm changes (after save/close)

  // Handle creating a new lecture
  const handleNewLecture = () => {
    setSelectedLecture(null);
    setShowForm(true);
  };

  // Handle editing an existing lecture
  const handleEditLecture = (id: string, category: LectureCategory) => {
    try {
      const storageKey = `lecture-data-${category}-${id}`;
      const lectureData = localStorage.getItem(storageKey);

      if (lectureData) {
        const lecture = JSON.parse(lectureData) as Lecture;
        setSelectedLecture({ lecture, category });
        setShowForm(true);
      }
    } catch (e) {
      console.error("Error loading lecture for edit", e);
    }
  };

  // Handle deleting a lecture
  const handleDeleteLecture = (id: string, category: LectureCategory) => {
    if (confirm(`Are you sure you want to delete the lecture "${id}"?`)) {
      try {
        // Remove from localStorage
        localStorage.removeItem(`lecture-data-${category}-${id}`);
        localStorage.removeItem(`lecture-typescript-${category}-${id}`);

        // Update state
        setSavedLectures(prev => prev.filter(lecture => !(lecture.id === id && lecture.category === category)));
      } catch (e) {
        console.error("Error deleting lecture", e);
      }
    }
  };

  // Handle lecture save
  const handleSaveLecture = (lecture: Lecture, category: LectureCategory) => {
    setShowForm(false);
    // Refresh the saved lectures list
    setSavedLectures(prev => {
      const exists = prev.some(l => l.id === lecture.id && l.category === category);

      if (exists) {
        // Update existing
        return prev.map(l => {
          if (l.id === lecture.id && l.category === category) {
            return {
              ...l,
              title: lecture.title,
              lastModified: new Date()
            };
          }
          return l;
        });
      } else {
        // Add new
        return [
          ...prev,
          {
            id: lecture.id,
            title: lecture.title,
            category,
            lastModified: new Date()
          }
        ];
      }
    });
  };

  // Copy TypeScript code to clipboard
  const handleCopyCode = (id: string, category: LectureCategory) => {
    try {
      const codeKey = `lecture-typescript-${category}-${id}`;
      const code = localStorage.getItem(codeKey);

      if (code) {
        navigator.clipboard.writeText(code);
        alert("TypeScript code copied to clipboard");
      } else {
        alert("No TypeScript code found for this lecture");
      }
    } catch (e) {
      console.error("Error copying code", e);
      alert("Error copying code");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Lecture Admin Dashboard</h1>

      {showForm ? (
        <div>
          <button
            onClick={() => setShowForm(false)}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Lecture List
          </button>

          <AdminLectureForm
            initialLecture={selectedLecture?.lecture}
            initialCategory={selectedLecture?.category}
            onSave={handleSaveLecture}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Lectures</h2>
            <button
              onClick={handleNewLecture}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + New Lecture
            </button>
          </div>

          {savedLectures.length === 0 ? (
            <div className="bg-gray-100 p-8 text-center rounded-lg">
              <p className="text-gray-600">No lectures created yet. Click "New Lecture" to get started.</p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {savedLectures.map((lecture) => (
                      <tr key={`${lecture.category}-${lecture.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lecture.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecture.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lecture.category.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleEditLecture(lecture.id, lecture.category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCopyCode(lecture.id, lecture.category)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Copy Code
                            </button>
                            <button
                              onClick={() => handleDeleteLecture(lecture.id, lecture.category)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContainer;
