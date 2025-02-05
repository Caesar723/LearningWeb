"use client"

import { useState, useRef, useEffect } from "react"
import { ChatBox, ChatMessage } from "@/components/learning/ChatBox";

interface InteractionEngineProps {
  currentNode: string | null
  setProgress: (progress: number) => void
  setShowQuiz: (show: boolean) => void
  setShowQuestions: (show: boolean) => void
  addQuestion: (question: string) => void
  isQuestion: boolean
}

type Conversation = {
  id: string;             // 聊天唯一标识
  messages: ChatMessage[]; // 此聊天的所有消息
};

function testTalkingCard(setConversations: (conversations: Conversation[]) => void,setShowUnderstandingPrompt: (show: boolean) => void) {
  useEffect(() => {
    const interval = setInterval(() => {
      const newId = `conv-${Date.now()}`;
      const newConversation: Conversation = {
        id: newId,
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `这是新的 ChatBox（ID: ${newId}）的第一条消息。`,
          },
        ],
      };
      setConversations((prev) => [...prev, newConversation]);
      setShowUnderstandingPrompt(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);
}

export default function InteractionEngine({
  currentNode,
  setProgress,
  setShowQuiz,
  setShowQuestions,
  addQuestion,
  isQuestion,
}: InteractionEngineProps) {
  const [aiResponse, setAiResponse] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showUnderstandingPrompt, setShowUnderstandingPrompt] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      messages: [
        {
          id: "msg-1",
          role: "assistant",
          content: "你好，我是第一个 ChatBox 的 AI 助手！\n\n**这里有一个代码示例：**\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('World'))\n```\n\n- 如果你有任何问题，请随时提问。\n- 我会尽力帮助你解答。\n\n我们的学习平台旨在提供一个互动和高效的学习环境。无论你是初学者还是有经验的学习者，我们都希望你能在这里找到你需要的资源和支持。\n\n在这里，你可以探索各种学习材料，参加测验，提升你的知识水平。\n\n*祝你学习愉快，并取得优异的成绩！*",
        },
      ],
    },
  ]);

  testTalkingCard(setConversations,setShowUnderstandingPrompt);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatRef]) //Corrected dependency

  const handleSubmit = () => {
    if (userInput.trim() === "") return

    setIsGenerating(true)
    // Simulating AI response generation
    setTimeout(() => {
      setAiResponse((prev) => `${prev}\n\nUser: ${userInput}\n\nAI: Response to "${userInput}"`)
      setUserInput("")
      setIsGenerating(false)
      setProgress((prevProgress) => Math.min(prevProgress + 10, 100)) // Increment progress
      setShowUnderstandingPrompt(true)

      // Simulating API response to start quiz
      if (Math.random() > 0.7) {
        // 30% chance to start a quiz
        setShowQuiz(true)
      }
    }, 2000)
  }

  const handleUnderstanding = (understood: boolean) => {
    if (understood) {
      setShowUnderstandingPrompt(false)
      setProgress((prevProgress: number) => Math.min(prevProgress + 15, 100)) // Increment progress when understood
    } else {
      setShowQuestions(true)
      addQuestion(currentNode || "Unknown topic")
      setAiResponse((prev: string) => `${prev}\n\nAI: I understand you're having trouble. Let's break it down further...`)
    }
  }

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
      <div ref={chatRef} className="flex-1 mb-4 overflow-auto h-full p-4 bg-gray-100 dark:bg-gray-700 rounded pb-[136px]">
      {conversations.map((conv) => (
        <ChatBox
          key={conv.id}
          messages={conv.messages}
          title={`ChatBox ID: ${conv.id}`}
        />
      ))}
        {isGenerating && <div className="mt-2 text-gray-500 dark:text-gray-400">AI is generating a response...</div>}
      </div>
      {showUnderstandingPrompt && !isQuestion && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-800 rounded">
          <p className="mb-2">Did you understand the explanation?</p>
          <button
            onClick={() => handleUnderstanding(true)}
            className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Yes, I understood
          </button>
          <button
            onClick={() => handleUnderstanding(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            No, I need more explanation
          </button>
        </div>
      )}
      {isQuestion && (
        <div className="mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded ">
          <div className="max-w-4xl mx-auto p-4 w-full">
            <div className="flex gap-2 w-full">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                    handleSubmit()
                  }
                }}
                className="flex-grow p-4 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-green-500"
                placeholder="Type your question here"
                rows={1}
                style={{ maxHeight: '150px', overflowY: 'auto' }}
                onInput={(e) => {
                  e.currentTarget.style.height = 'auto';
                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                }}
              />
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                disabled={isGenerating}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

