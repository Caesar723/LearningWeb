"use client"

import { useState } from "react"

interface InitialDialogProps {
  onTopicSelect: (topic: string) => void
}

export default function InitialDialog({ onTopicSelect }: InitialDialogProps) {
  const [topic, setTopic] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onTopicSelect(topic.trim())
      
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">What would you like to learn?</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200"
            placeholder="Enter a topic"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </button>
        </form>
      </div>
    </div>
  )
}

