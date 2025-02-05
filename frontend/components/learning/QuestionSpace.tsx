"use client"

import { useState } from "react"
import InteractionEngine from "./InteractionEngine"

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"

interface LearningSpaceProps {
  initialTopic: string
}

export default function QuestionSpace({ initialTopic }: LearningSpaceProps) {
  const [currentNode, setCurrentNode] = useState<string | null>(initialTopic)
  const [isTreeVisible, setIsTreeVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  
  

  const addQuestion = (question: string) => {
    setQuestions((prevQuestions) => [...prevQuestions, question])
  }

  return (
    
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className=" text-xl font-bold mb-4">Question Space</h2>
      <div className="h-full flex-1 overflow-auto p-4">
          <InteractionEngine
            currentNode={currentNode}
            setProgress={setProgress}
            setShowQuiz={setShowQuiz}
            setShowQuestions={() => {}}
            addQuestion={addQuestion}
            isQuestion={true}
          />
        </div>
    </div>
  )
}