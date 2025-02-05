"use client"

import { useState } from "react"
import Link from "next/link"

const topics = ["Mathematics", "Physics", "Computer Science", "Biology", "History"]

export default function TopicSidebar() {
  const [selectedTopic, setSelectedTopic] = useState("")

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Learning Topics</h2>
        <ul>
          {topics.map((topic) => (
            <li key={topic} className="mb-2">
              <Link href={`/learn/${topic}`}>
                <span
                  className={`block p-2 rounded ${
                    selectedTopic === topic
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

