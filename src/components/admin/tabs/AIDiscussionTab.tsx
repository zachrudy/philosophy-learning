// src/components/admin/tabs/AIDiscussionTab.tsx
import React from 'react';

const AIDiscussionTab = ({ form }: { form: any }) => {
  return (
    <div className="bg-gray-50 p-4 rounded border">
      <h2 className="text-lg font-bold mb-4">AI Discussion Prompts</h2>
      <p className="text-sm text-gray-700 mb-4">
        These prompts help structure the AI's evaluation of student mastery and exploration of topics.
      </p>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Understanding (Mastery Evaluation)</h3>
        <p className="text-sm text-gray-600 mb-2">
          This prompt is used to evaluate student's mastery of core concepts in their reflection.
          Be specific about what mastery looks like for this lecture.
        </p>
        <textarea
          value={form.lecture.prompts.aiDiscussion.understanding}
          onChange={(e) => form.handleAIDiscussionChange('understanding', e.target.value)}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
          placeholder="Explain how mastery of this topic would be demonstrated. For example: 'A mastery response should clearly explain how the different branches of philosophy interact and overlap. The student should demonstrate understanding of how metaphysics relates to epistemology, and how both relate to ethics. They should show awareness of the historical development of these distinctions and why they matter.'"
        />

        <div className="mt-2 bg-blue-50 p-3 rounded border border-blue-200">
          <h4 className="text-sm font-semibold mb-2">Mastery Evaluation Guidelines</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Be specific about what concepts the student must understand</li>
            <li>Include both breadth (covering all major topics) and depth (analyzing relationships)</li>
            <li>Consider historical context and contemporary relevance when appropriate</li>
            <li>Include criteria for recognizing when concepts are misunderstood</li>
            <li>Provide guidance on how to evaluate quality of reflection</li>
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Exploration</h3>
        <p className="text-sm text-gray-600 mb-2">
          This prompt encourages students to explore implications and applications of the concepts.
        </p>
        <textarea
          value={form.lecture.prompts.aiDiscussion.exploration}
          onChange={(e) => form.handleAIDiscussionChange('exploration', e.target.value)}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
          placeholder="How might the tension between Athens and Jerusalem help us understand modern debates?"
        />

        <div className="mt-2 bg-blue-50 p-3 rounded border border-blue-200">
          <h4 className="text-sm font-semibold mb-2">Exploration Prompt Guidelines</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Connect lecture concepts to contemporary issues or debates</li>
            <li>Encourage application of philosophical frameworks to real-world problems</li>
            <li>Suggest exploring tensions or seeming contradictions</li>
            <li>Prompt critical thinking about the implications of philosophical positions</li>
            <li>Consider interdisciplinary connections when appropriate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIDiscussionTab;
