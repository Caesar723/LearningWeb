"use client"

import { useState } from "react"

export default function Notebook({ topic, currentNode }: { topic: string; currentNode: string | null }) {
  const [aiResponse, setAiResponse] = useState("")
  const [userQuestion, setUserQuestion] = useState("")
  const [showQuiz, setShowQuiz] = useState(false)

  const handleAskAI = async () => {
    // This should call an AI API to get a response
    // For now, we use mock data
    setAiResponse(`Here's a detailed explanation about ${currentNode} in ${topic}...`)
  }

  const handleUserQuestion = async () => {
    // This should call an AI API to answer the user's question
    // For now, we use mock data
    setAiResponse(`Here's the answer to your question "${userQuestion}"...`)
    setUserQuestion("")
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
    // This should call an AI API to generate quiz questions
    // For now, we use mock data
    setAiResponse("Here's a quiz question about the current topic...")
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Learning Notes: {currentNode}</h2>
      <div className="mb-4">
        <button
          onClick={handleAskAI}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition-colors"
        >
          Ask AI
        </button>
        <button
          onClick={handleStartQuiz}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Start Quiz
        </button>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded min-h-[200px] mb-4 text-gray-800 dark:text-gray-200">
        {aiResponse || 'Click "Ask AI" to start learning'}
      </div>
      {!showQuiz && (
        <div>
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            placeholder="Any questions? Ask here"
          />
          <button
            onClick={handleUserQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors"
          >
            Submit Question
          </button>
        </div>
      )}
    </div>
  )
}

