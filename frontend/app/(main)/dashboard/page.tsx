"use client"

import { useState } from "react"
import LearningSpace from "@/components/learning/LearningSpace"
import NewChatButton from "@/components/learning/NewChatButton"
import InitialDialog from "@/components/learning/InitialDialog"
import ThemeToggle from "@/components/auth/ThemeToggle"
import Account from "@/components/auth/Account"

export default function Home() {
  const [learningSpaces, setLearningSpaces] = useState<string[]>([])
  const [activeSpace, setActiveSpace] = useState<string | null>(null)

  const createNewSpace = (topic: string) => {
    setLearningSpaces((prev) => [...prev, topic])
    if (topic) {
      setLearningSpaces((prev) => prev.filter((t) => t !== ""))
    }
    setActiveSpace(topic)
  }

  return (
    <div className="flex h-screen transition-colors duration-300 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {/* <div className="absolute left-0 bottom-0 m-4"> */}
      <Account username="John Doe" onLogout={() => {console.log("logout")}} />
      {/* </div> */}
      
      <div className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Learning Platform</h1>
        <NewChatButton onClick={() => createNewSpace("")} />
        <div className="mt-4 flex-1 overflow-auto">
          {learningSpaces.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveSpace(topic)}
              className={`w-full text-left p-2 mb-2 rounded ${
                activeSpace === topic
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {topic || "Untitled Space"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeSpace === "" ? (
          <InitialDialog onTopicSelect={createNewSpace} />
        ) : activeSpace ? (
          <LearningSpace key={activeSpace} initialTopic={activeSpace} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a learning space or create a new one
          </div>
        )}
      </div>
    </div>
  )
}

