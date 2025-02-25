// src/hooks/useLectureForm.ts
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Lecture,
  Reading,
  Question,
  WatchPoint,
  ReflectionPrompt,
  ConceptNode
} from '../types/lecture';

// Predefined categories for the lectures
export const LECTURE_CATEGORIES = [
  'introductions',
  'jerusalem',
  'athens_to_rome',
  'medieval_renaissance',
  'early_modernity',
  'modernity',
  'nineteenth_century',
  'contemporary',
  'conclusions'
] as const;

export type LectureCategory = typeof LECTURE_CATEGORIES[number];

// Default empty lecture
export const defaultLecture: Lecture = {
  id: "",
  title: "",
  videoUrl: "",
  prerequisites: [],
  readingMaterials: {
    required: [],
    supplementary: [],
  },
  prompts: {
    readiness: [],
    during: [],
    reflection: [],
    aiDiscussion: {
      understanding: "",
      exploration: ""
    }
  },
  concepts: []
};

interface UseLectureFormProps {
  initialLecture?: Lecture;
  initialCategory?: LectureCategory;
  onSave?: (lecture: Lecture, category: LectureCategory) => void;
}

export const useLectureForm = ({
  initialLecture,
  initialCategory = 'introductions',
  onSave
}: UseLectureFormProps = {}) => {
  const [lecture, setLecture] = useState<Lecture>(initialLecture || {...defaultLecture, id: uuidv4()});
  const [category, setCategory] = useState<LectureCategory>(initialCategory);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [newPrerequisite, setNewPrerequisite] = useState<string>("");
  const [newReadingRequired, setNewReadingRequired] = useState<Reading>({title: ""});
  const [newReadingSupplementary, setNewReadingSupplementary] = useState<Reading>({title: ""});
  const [newBiblePassage, setNewBiblePassage] = useState<string>("");
  const [newReadinessQuestion, setNewReadinessQuestion] = useState<Question>({id: "", text: "", concepts: []});
  const [newWatchPoint, setNewWatchPoint] = useState<WatchPoint>({timestamp: "", focus: "", prompt: "", concepts: []});
  const [newReflectionPrompt, setNewReflectionPrompt] = useState<ReflectionPrompt>({id: "", text: "", type: "initial", concepts: []});
  const [newConceptNode, setNewConceptNode] = useState<ConceptNode>({id: "", name: "", relatedConcepts: [], lectures: []});

  // Load existing lectures for reference when selecting prerequisites
  const [existingLectures, setExistingLectures] = useState<Array<{id: string, title: string}>>([]);

  useEffect(() => {
    // Load existing lectures from localStorage
    const loadExistingLectures = () => {
      try {
        const lecturesList: Array<{id: string, title: string}> = [];

        // Loop through all localStorage keys to find lectures
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('lecture-data-')) {
            try {
              const lectureData = JSON.parse(localStorage.getItem(key) || "");
              if (lectureData.id && lectureData.title) {
                lecturesList.push({
                  id: lectureData.id,
                  title: lectureData.title
                });
              }
            } catch (e) {
              console.error("Error parsing lecture data", e);
            }
          }
        }

        setExistingLectures(lecturesList);
      } catch (e) {
        console.error("Error loading existing lectures", e);
      }
    };

    loadExistingLectures();
  }, []);

  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLecture(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as LectureCategory);
  };

  // Handle array item changes (prerequisites)
  const handleArrayItemChange = (
    arrayName: 'prerequisites',
    index: number,
    value: string
  ) => {
    setLecture(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  // Add an item to an array (prerequisites)
  const handleAddArrayItem = (
    arrayName: 'prerequisites',
    value: string
  ) => {
    if (!value.trim()) return;

    setLecture(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], value]
    }));

    // Reset the input field
    if (arrayName === 'prerequisites') {
      setNewPrerequisite("");
    }
  };

  // Remove an item from an array (prerequisites)
  const handleRemoveArrayItem = (
    arrayName: 'prerequisites',
    index: number
  ) => {
    setLecture(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };

  // Handle Reading changes
  const handleReadingChange = (
    type: 'required' | 'supplementary',
    index: number,
    field: keyof Reading,
    value: string
  ) => {
    setLecture(prev => {
      const newReadings = [...prev.readingMaterials[type]];
      newReadings[index] = {
        ...newReadings[index],
        [field]: value
      };
      return {
        ...prev,
        readingMaterials: {
          ...prev.readingMaterials,
          [type]: newReadings
        }
      };
    });
  };

  // Add a reading
  const handleAddReading = (type: 'required' | 'supplementary', reading: Reading) => {
    if (!reading.title.trim()) return;

    setLecture(prev => ({
      ...prev,
      readingMaterials: {
        ...prev.readingMaterials,
        [type]: [...prev.readingMaterials[type], reading]
      }
    }));

    // Reset the input
    if (type === 'required') {
      setNewReadingRequired({title: ""});
    } else {
      setNewReadingSupplementary({title: ""});
    }
  };

  // Remove a reading
  const handleRemoveReading = (type: 'required' | 'supplementary', index: number) => {
    setLecture(prev => {
      const newReadings = [...prev.readingMaterials[type]];
      newReadings.splice(index, 1);
      return {
        ...prev,
        readingMaterials: {
          ...prev.readingMaterials,
          [type]: newReadings
        }
      };
    });
  };

  // Handle Bible Passages
  const handleAddBiblePassage = (passage: string) => {
    if (!passage.trim()) return;

    setLecture(prev => {
      const currentPassages = prev.readingMaterials.biblePassages || [];
      return {
        ...prev,
        readingMaterials: {
          ...prev.readingMaterials,
          biblePassages: [...currentPassages, passage]
        }
      };
    });

    setNewBiblePassage("");
  };

  const handleRemoveBiblePassage = (index: number) => {
    setLecture(prev => {
      if (!prev.readingMaterials.biblePassages) return prev;

      const newPassages = [...prev.readingMaterials.biblePassages];
      newPassages.splice(index, 1);
      return {
        ...prev,
        readingMaterials: {
          ...prev.readingMaterials,
          biblePassages: newPassages
        }
      };
    });
  };

  // Handle Readiness Questions
  const handleReadinessQuestionChange = (
    index: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    setLecture(prev => {
      const newQuestions = [...prev.prompts.readiness];

      if (field === 'concepts' && typeof value === 'string') {
        // Split the comma-separated string into an array
        newQuestions[index] = {
          ...newQuestions[index],
          concepts: value.split(',').map(item => item.trim())
        };
      } else {
        newQuestions[index] = {
          ...newQuestions[index],
          [field]: value
        };
      }

      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          readiness: newQuestions
        }
      };
    });
  };

  const handleAddReadinessQuestion = (question: Question) => {
    if (!question.text.trim()) return;

    const newQuestion = {
      ...question,
      id: question.id || uuidv4()
    };

    setLecture(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        readiness: [...prev.prompts.readiness, newQuestion]
      }
    }));

    setNewReadinessQuestion({id: "", text: "", concepts: []});
  };

  const handleRemoveReadinessQuestion = (index: number) => {
    setLecture(prev => {
      const newQuestions = [...prev.prompts.readiness];
      newQuestions.splice(index, 1);
      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          readiness: newQuestions
        }
      };
    });
  };

  // Handle Watch Points
  const handleWatchPointChange = (
    index: number,
    field: keyof WatchPoint,
    value: string | string[]
  ) => {
    setLecture(prev => {
      const newWatchPoints = [...prev.prompts.during];

      if (field === 'concepts' && typeof value === 'string') {
        // Split the comma-separated string into an array
        newWatchPoints[index] = {
          ...newWatchPoints[index],
          concepts: value.split(',').map(item => item.trim())
        };
      } else {
        newWatchPoints[index] = {
          ...newWatchPoints[index],
          [field]: value
        };
      }

      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          during: newWatchPoints
        }
      };
    });
  };

  const handleAddWatchPoint = (watchPoint: WatchPoint) => {
    if (!watchPoint.focus.trim() || !watchPoint.prompt.trim()) return;

    setLecture(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        during: [...prev.prompts.during, watchPoint]
      }
    }));

    setNewWatchPoint({timestamp: "", focus: "", prompt: "", concepts: []});
  };

  const handleRemoveWatchPoint = (index: number) => {
    setLecture(prev => {
      const newWatchPoints = [...prev.prompts.during];
      newWatchPoints.splice(index, 1);
      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          during: newWatchPoints
        }
      };
    });
  };

  // Handle Reflection Prompts
  const handleReflectionPromptChange = (
    index: number,
    field: keyof ReflectionPrompt,
    value: string | string[] | 'initial' | 'mastery'
  ) => {
    setLecture(prev => {
      const newPrompts = [...prev.prompts.reflection];

      if (field === 'concepts' && typeof value === 'string') {
        // Split the comma-separated string into an array
        newPrompts[index] = {
          ...newPrompts[index],
          concepts: value.split(',').map(item => item.trim())
        };
      } else {
        newPrompts[index] = {
          ...newPrompts[index],
          [field]: value
        };
      }

      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          reflection: newPrompts
        }
      };
    });
  };

  const handleAddReflectionPrompt = (prompt: ReflectionPrompt) => {
    if (!prompt.text.trim()) return;

    const newPrompt = {
      ...prompt,
      id: prompt.id || uuidv4()
    };

    setLecture(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        reflection: [...prev.prompts.reflection, newPrompt]
      }
    }));

    setNewReflectionPrompt({id: "", text: "", type: "initial", concepts: []});
  };

  const handleRemoveReflectionPrompt = (index: number) => {
    setLecture(prev => {
      const newPrompts = [...prev.prompts.reflection];
      newPrompts.splice(index, 1);
      return {
        ...prev,
        prompts: {
          ...prev.prompts,
          reflection: newPrompts
        }
      };
    });
  };

  // Handle AI Discussion prompts
  const handleAIDiscussionChange = (
    field: 'understanding' | 'exploration',
    value: string
  ) => {
    setLecture(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        aiDiscussion: {
          ...prev.prompts.aiDiscussion,
          [field]: value
        }
      }
    }));
  };

  // Handle Concept Nodes
  const handleConceptNodeChange = (
    index: number,
    field: keyof ConceptNode,
    value: string | string[] | any[]
  ) => {
    setLecture(prev => {
      const newConcepts = [...prev.concepts];

      if (field === 'lectures' && typeof value === 'string') {
        // Split the comma-separated string into an array
        newConcepts[index] = {
          ...newConcepts[index],
          lectures: value.split(',').map(item => item.trim())
        };
      } else {
        newConcepts[index] = {
          ...newConcepts[index],
          [field]: value
        };
      }

      return {
        ...prev,
        concepts: newConcepts
      };
    });
  };

  const handleAddConceptNode = (concept: ConceptNode) => {
    if (!concept.id.trim() || !concept.name.trim()) return;

    // Make sure current lecture ID is in the list of related lectures
    if (!concept.lectures.includes(lecture.id)) {
      concept.lectures = [...concept.lectures, lecture.id];
    }

    setLecture(prev => ({
      ...prev,
      concepts: [...prev.concepts, concept]
    }));

    setNewConceptNode({id: "", name: "", relatedConcepts: [], lectures: []});
  };

  const handleRemoveConceptNode = (index: number) => {
    setLecture(prev => {
      const newConcepts = [...prev.concepts];
      newConcepts.splice(index, 1);
      return {
        ...prev,
        concepts: newConcepts
      };
    });
  };

  // Generate TypeScript code for the lecture
  const generateTypeScriptCode = (lecture: Lecture, category: LectureCategory): string => {
    // Create a formatted version of the lecture object
    const formatValue = (value: any, level: number = 0): string => {
      const indent = '  '.repeat(level);

      if (value === null || value === undefined) {
        return 'null';
      }

      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`;
      }

      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]';
        }

        return `[\n${value.map(item => `${indent}  ${formatValue(item, level + 1)}`).join(',\n')}\n${indent}]`;
      }

      if (typeof value === 'object') {
        const entries = Object.entries(value);
        if (entries.length === 0) {
          return '{}';
        }

        return `{\n${entries.map(([key, val]) =>
          `${indent}  ${key}: ${formatValue(val, level + 1)}`
        ).join(',\n')}\n${indent}}`;
      }

      return String(value);
    };

    // Create the full TypeScript file content
    const fileContent = `// src/data/lectures/${category}/${lecture.id}.ts
import { Lecture } from '../../../types/lecture';

// Define any constants or helper types here
const philosophyConcepts = {
  // Add your philosophy concepts here as needed
  PHIL_BASICS: 'philosophy-basics',
  PHYSICS: 'physics-nature',
  METAPHYSICS: 'metaphysics',
  ONTOLOGY: 'ontology',
  LOGIC: 'logic',
  EPISTEMOLOGY: 'epistemology',
  AESTHETICS: 'aesthetics',
  ETHICS: 'ethics',
  POLITICAL: 'political-theory',
  ATHENS: 'athens-tradition',
  JERUSALEM: 'jerusalem-tradition'
} as const;

const ${lecture.id}Lecture: Lecture = ${formatValue(lecture, 0)};

export default ${lecture.id}Lecture;
`;

    return fileContent;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!lecture.id || !lecture.title || !lecture.videoUrl) {
        alert("Please fill in all required fields (ID, Title, Video URL)");
        return;
      }

      // Save to localStorage
      const storageKey = `lecture-data-${category}-${lecture.id}`;
      localStorage.setItem(storageKey, JSON.stringify(lecture));

      // Generate TypeScript code for this lecture
      const tsCode = generateTypeScriptCode(lecture, category);
      localStorage.setItem(`lecture-typescript-${category}-${lecture.id}`, tsCode);

      // Call onSave callback if provided
      if (onSave) {
        onSave(lecture, category);
      }

      setSaveMessage("Lecture saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e) {
      console.error("Error saving lecture", e);
      setSaveMessage("Error saving lecture");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return {
    // State
    lecture,
    category,
    activeTab,
    saveMessage,
    previewMode,
    newPrerequisite,
    newReadingRequired,
    newReadingSupplementary,
    newBiblePassage,
    newReadinessQuestion,
    newWatchPoint,
    newReflectionPrompt,
    newConceptNode,
    existingLectures,

    // Setters
    setLecture,
    setCategory,
    setActiveTab,
    setPreviewMode,
    setNewPrerequisite,
    setNewReadingRequired,
    setNewReadingSupplementary,
    setNewBiblePassage,
    setNewReadinessQuestion,
    setNewWatchPoint,
    setNewReflectionPrompt,
    setNewConceptNode,

    // Handlers
    handleBasicInfoChange,
    handleCategoryChange,
    handleArrayItemChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleReadingChange,
    handleAddReading,
    handleRemoveReading,
    handleAddBiblePassage,
    handleRemoveBiblePassage,
    handleReadinessQuestionChange,
    handleAddReadinessQuestion,
    handleRemoveReadinessQuestion,
    handleWatchPointChange,
    handleAddWatchPoint,
    handleRemoveWatchPoint,
    handleReflectionPromptChange,
    handleAddReflectionPrompt,
    handleRemoveReflectionPrompt,
    handleAIDiscussionChange,
    handleConceptNodeChange,
    handleAddConceptNode,
    handleRemoveConceptNode,
    handleSubmit,

    // Utilities
    generateTypeScriptCode
  };
};

export default useLectureForm;
