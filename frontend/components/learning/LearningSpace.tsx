"use client"

import { useState, useRef } from "react"
import KnowledgeTree from "./KnowledgeTree"
import InteractionEngine from "./InteractionEngine"
import QuizModal from "./QuizModal"
import QuestionSpace from "./QuestionSpace"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import { Message } from "@/lib/types"

interface LearningSpaceProps {
  initialTopic: string
}

export default function LearningSpace({ initialTopic }: LearningSpaceProps) {
  const [currentNode, setCurrentNode] = useState<string | null>(initialTopic)
  const [isTreeVisible, setIsTreeVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [currentLearningSpace, setCurrentLearningSpace] = useState<Message[] | null>(null)


  const toggleTree = () => {
    setIsTreeVisible(!isTreeVisible)
  }

  const addQuestion = (question: string) => {
    setQuestions((prevQuestions) => [...prevQuestions, question])
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startLeftWidth = containerRef.current?.offsetWidth || 0
    const totalWidth = containerRef.current?.parentElement?.offsetWidth || 0
  
    const doDrag = (e: MouseEvent) => {
      if (containerRef.current) {
        const newLeftWidth = startLeftWidth + (e.clientX - startX)
        const newRightWidth = totalWidth - newLeftWidth - 2 // 分隔条宽度
        
        // 设置最小宽度限制
        if (newLeftWidth > 200 && newRightWidth > 200) { 
          containerRef.current.style.width = `${newLeftWidth}px`
          // 直接操作右侧面板的DOM
          const rightPanel = containerRef.current.parentElement?.children[2] as HTMLElement
          if (rightPanel) {
            rightPanel.style.width = `${newRightWidth}px`
          }
        }
      }
    }
  
    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag)
      document.removeEventListener("mouseup", stopDrag)
    }
  
    document.addEventListener("mousemove", doDrag)
    document.addEventListener("mouseup", stopDrag)
  }


  return (
    <div className="h-full flex flex-col ">
      <h1 className="text-3xl font-bold my-6 text-gray-800 dark:text-gray-200 ml-4">
         {decodeURIComponent(initialTopic)}
      </h1>
      <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full">
        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="relative">
        
        <div className={`transition-all duration-300 ${isTreeVisible ? "h-64" : "h-0"} overflow-hidden`}>
          <KnowledgeTree currentNode={currentNode} setCurrentNode={setCurrentNode} currentLearningSpace={currentLearningSpace} setCurrentLearningSpace={setCurrentLearningSpace} />
        </div>
        <div
          onClick={toggleTree}
          className="relative top-0 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 bg-opacity-50 text-center w-6 h-6 rounded-bl-full rounded-br-full flex items-center justify-center cursor-pointer"
        >
          {isTreeVisible ? (
            <>
              <ChevronUpIcon className="h-5 w-5 mx-auto" />
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-5 w-5 mx-auto" />
            </>
          )}
        </div>

      </div>
      
      <div className="flex-1 overflow-hidden flex">
        <div 
          className="flex-grow p-4" 
          ref={containerRef}
          style={{ minWidth: '200px', maxWidth: '100%' }} // 添加限制
        >
          <InteractionEngine
            currentNode={currentNode}
            setProgress={setProgress}
            setShowQuiz={setShowQuiz}
            setShowQuestions={setShowQuestions}
            addQuestion={addQuestion}
            isQuestion={false}
          />
        </div>
  
        {(showQuestions || showQuiz) && ( 
          <>
            <div 
              className="w-1.5 bg-gray-400 hover:bg-blue-500 cursor-col-resize transition-colors"
              onMouseDown={handleMouseDown}
            />
            <div 
              className="h-full flex-grow bg-gray-100 dark:bg-gray-800 p-4" // 添加 overflow-auto
              style={{ minWidth: '200px', maxWidth: '80%' }}
            >
              {showQuestions && <QuestionSpace initialTopic={initialTopic} />}
              {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
            </div>
          </>
        )}
      </div>
     
    </div>
  )
}

