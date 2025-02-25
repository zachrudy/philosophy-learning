import { useState } from 'react'
import './App.css'
import LectureTest from './components/lectures/LectureTest'
import { AdminContainer } from './components/admin'

function App() {
  const [currentView, setCurrentView] = useState<'lecture' | 'admin'>('lecture')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Philosophy Learning System</h1>
              <p className="text-gray-600">Test environment for lecture system</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('lecture')}
                className={`px-4 py-2 rounded ${
                  currentView === 'lecture'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Lecture View
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded ${
                  currentView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Admin View
              </button>
            </div>
          </div>
        </header>
        <main>
          {currentView === 'lecture' ? <LectureTest /> : <AdminContainer />}
        </main>
      </div>
    </div>
  )
}

export default App
