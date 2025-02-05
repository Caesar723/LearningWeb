"use client"

import { useState } from "react"

interface QuizModalProps {
  onClose: () => void
}

export default function QuizModal({ onClose }: QuizModalProps) {
  const [quizQuestion, setQuizQuestion] = useState("This is a sample quiz question?")
  const [quizAnswer, setQuizAnswer] = useState("This is the answer to the quiz question.")
  const [isAnswerVisible, setIsAnswerVisible] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Quiz Time</h2>
      <p className="mb-4">{quizQuestion}</p>
      <div className="mb-4">
        <p className="font-bold mb-2">Answer:</p>
        <p className={isAnswerVisible ? "" : "blur-sm select-none"}>{quizAnswer}</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setIsAnswerVisible(!isAnswerVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isAnswerVisible ? "Hide Answer" : "Show Answer"}
        </button>
        <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Close Quiz
        </button>
      </div>
    </div>
  )
}

