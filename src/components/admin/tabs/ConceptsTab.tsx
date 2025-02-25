// src/components/admin/tabs/ConceptsTab.tsx
import React, { useEffect, useState } from 'react';

const ConceptsTab = ({ form }: { form: any }) => {
  // State to track all existing concepts from storage
  const [existingConcepts, setExistingConcepts] = useState<Array<{id: string, name: string}>>([]);

  // Load all existing concepts from localStorage
  useEffect(() => {
    const loadExistingConcepts = () => {
      try {
        const conceptsList: Array<{id: string, name: string}> = [];

        // Loop through all localStorage keys to find lectures with concepts
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('lecture-data-')) {
            try {
              const lectureData = JSON.parse(localStorage.getItem(key) || "");
              if (lectureData.concepts && Array.isArray(lectureData.concepts)) {
                // Extract concepts and add them to our list if they don't already exist
                lectureData.concepts.forEach((concept: any) => {
                  if (concept.id && concept.name && !conceptsList.some(c => c.id === concept.id)) {
                    conceptsList.push({
                      id: concept.id,
                      name: concept.name
                    });
                  }
                });
              }
            } catch (e) {
              console.error("Error parsing lecture data", e);
            }
          }
        }

        // Sort alphabetically by name
        conceptsList.sort((a, b) => a.name.localeCompare(b.name));
        setExistingConcepts(conceptsList);
      } catch (e) {
        console.error("Error loading existing concepts", e);
      }
    };

    loadExistingConcepts();
  }, [form.lecture.concepts]); // Reload when concepts change

  // Helper function to convert a concept name to a kebab-case ID
  const generateConceptId = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Add an existing concept to this lecture
  const addExistingConcept = (e: React.MouseEvent, conceptId: string, conceptName: string) => {
    e.preventDefault();

    // Check if this concept is already added to the lecture
    if (form.lecture.concepts.some((c: any) => c.id === conceptId)) {
      return; // Already added, do nothing
    }

    // Create a new concept node with this information
    const newNode = {
      id: conceptId,
      name: conceptName,
      relatedConcepts: [],
      lectures: [form.lecture.id] // Add current lecture as related
    };

    // Add the concept node
    form.handleAddConceptNode(newNode);
  };

  // Handle adding a brand new concept
  const handleAddConcept = (e: React.MouseEvent) => {
    // Prevent any form submission
    e.preventDefault();
    e.stopPropagation();

    // Add the concept
    form.handleAddConceptNode(form.newConceptNode);
  };

  // Handle removing a concept
  const handleRemoveConcept = (e: React.MouseEvent, index: number) => {
    // Prevent any form submission
    e.preventDefault();

    // Remove the concept
    form.handleRemoveConceptNode(index);
  };

  // Calculate if a concept from the cloud is already in the lecture
  const isConceptInLecture = (conceptId: string) => {
    return form.lecture.concepts.some((c: any) => c.id === conceptId);
  };

  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">Lecture Concepts</h2>
      <p className="text-sm text-gray-700 mb-4">
        Define the key concepts covered in this lecture.
      </p>

      {/* Cloud of existing concepts */}
      {existingConcepts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Existing Concepts</h3>
          <p className="text-sm text-gray-600 mb-3">
            Click to add existing concepts to this lecture:
          </p>
          <div className="flex flex-wrap gap-2 bg-gray-100 p-3 rounded-lg border">
            {existingConcepts.map((concept) => (
              <button
                key={concept.id}
                onClick={(e) => addExistingConcept(e, concept.id, concept.name)}
                type="button"
                disabled={isConceptInLecture(concept.id)}
                className={`px-3 py-1 rounded-full text-sm flex items-center transition-colors
                  ${isConceptInLecture(concept.id)
                    ? 'bg-green-100 text-green-800 cursor-default'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  }`}
              >
                <span>{concept.name}</span>
                {!isConceptInLecture(concept.id) && <span className="ml-1 text-xs">+</span>}
                {isConceptInLecture(concept.id) && <span className="ml-1 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form to add a new concept */}
      <div className="border p-3 rounded bg-white mb-4">
        <h3 className="text-md font-semibold mb-2">Add New Concept</h3>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Concept Name *
          </label>
          <input
            type="text"
            value={form.newConceptNode.name}
            onChange={(e) => {
              const name = e.target.value;
              // Optionally auto-generate ID based on name
              const updatedNode = {
                ...form.newConceptNode,
                name,
                id: form.newConceptNode.id || generateConceptId(name)
              };
              form.setNewConceptNode(updatedNode);
            }}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Philosophy as love of wisdom"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Concept ID *
          </label>
          <input
            type="text"
            value={form.newConceptNode.id}
            onChange={(e) => form.setNewConceptNode({...form.newConceptNode, id: e.target.value})}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="philosophy-basics"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use kebab-case (e.g., athens-tradition)
          </p>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Lectures
          </label>
          <div className="flex">
            <input
              type="text"
              value={form.newConceptNode.lectures.join(', ')}
              onChange={(e) => {
                const lectures = e.target.value ? e.target.value.split(',').map((l: string) => l.trim()) : [];
                form.setNewConceptNode({...form.newConceptNode, lectures});
              }}
              className="flex-grow p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="intro-philosophy-scope"
            />
            <button
              type="button" // Explicitly set button type
              onClick={(e) => {
                e.preventDefault();
                // Add current lecture ID if not already in the list
                if (!form.newConceptNode.lectures.includes(form.lecture.id)) {
                  form.setNewConceptNode({
                    ...form.newConceptNode,
                    lectures: [...form.newConceptNode.lectures, form.lecture.id]
                  });
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-r hover:bg-gray-700"
              title="Add current lecture"
            >
              + Current
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            The current lecture will be automatically included
          </p>
        </div>

        {/* Related Concepts Section */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Concepts
          </label>
          <div className="bg-gray-50 p-3 rounded border mb-2">
            <p className="text-xs text-gray-500 mb-2">
              You can define concept relationships in your TypeScript file. A more comprehensive UI for managing concept relationships will be added in a future update.
            </p>
            <p className="text-xs text-gray-700">
              Example format:
              <code className="bg-gray-200 p-1 rounded mx-1">
                {`relatedConcepts: [
  { conceptId: 'logic', relationship: 'builds_on' },
  { conceptId: 'epistemology', relationship: 'contrasts_with' }
]`}
              </code>
            </p>
          </div>
        </div>

        <button
          type="button" // Explicitly set button type to prevent form submission
          onClick={handleAddConcept}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!form.newConceptNode.id || !form.newConceptNode.name}
        >
          Add New Concept
        </button>
      </div>

      {/* List of concepts in this lecture */}
      {form.lecture.concepts.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">Concepts in This Lecture</h3>
          <div className="space-y-4">
            {form.lecture.concepts.map((concept: any, index: number) => (
              <div key={index} className="border p-3 rounded bg-white">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{concept.name}</h4>
                  <button
                    type="button" // Explicitly set button type
                    onClick={(e) => handleRemoveConcept(e, index)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept ID
                  </label>
                  <input
                    type="text"
                    value={concept.id}
                    onChange={(e) => form.handleConceptNodeChange(index, 'id', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concept Name
                  </label>
                  <input
                    type="text"
                    value={concept.name}
                    onChange={(e) => form.handleConceptNodeChange(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Related Lectures (comma separated)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={concept.lectures.join(', ')}
                      onChange={(e) => form.handleConceptNodeChange(index, 'lectures', e.target.value)}
                      className="flex-grow p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button" // Explicitly set button type
                      onClick={(e) => {
                        e.preventDefault();
                        // Get current lectures
                        const currentLectures = Array.isArray(concept.lectures) ? concept.lectures : [];
                        // Add current lecture ID if not already in the list
                        if (!currentLectures.includes(form.lecture.id)) {
                          form.handleConceptNodeChange(
                            index,
                            'lectures',
                            [...currentLectures, form.lecture.id]
                          );
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-r hover:bg-gray-700"
                      title="Add current lecture"
                    >
                      + Current
                    </button>
                  </div>
                </div>

                {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Related Concepts
                    </label>
                    <div className="bg-gray-50 p-2 rounded">
                      {concept.relatedConcepts.map((rel: any, idx: number) => (
                        <div key={idx} className="text-sm py-1">
                          <span className="font-medium">{rel.conceptId}</span>
                          <span className="text-gray-500 ml-2">({rel.relationship})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptsTab;
