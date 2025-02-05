'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { KnowledgeNode, Quiz } from '@/lib/types'

type LearningContextType = {
  treeData: KnowledgeNode | null
  currentNode: KnowledgeNode | null
  progress: number
  setCurrentNode: (node: KnowledgeNode) => void
  updateProgress: (nodeId: string, status: 'started' | 'completed') => void
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [treeData, setTreeData] = useState<KnowledgeNode | null>(null)
  const [currentNode, setCurrentNode] = useState<KnowledgeNode | null>(null)
  const [progress, setProgress] = useState(0)

  // 模拟API调用获取知识树
  const fetchKnowledgeTree = async () => {
    // 实际项目中替换为真实API调用
    const mockTree: KnowledgeNode = {
      id: 'root',
      title: 'Machine Learning Basics',
      difficulty: 1,
      content: '<p>Introduction to machine learning...</p>',
      children: [
        {
          id: 'supervised',
          title: 'Supervised Learning',
          difficulty: 2,
          content: '<p>Learn with labeled data...</p>',
          quiz: {
            question: 'Which is an example of supervised learning?',
            options: ['Clustering', 'Regression', 'Dimensionality Reduction'],
            correctIndex: 1
          }
        }
      ]
    }
    setTreeData(mockTree)
    setCurrentNode(mockTree)
  }

  const updateProgress = (nodeId: string, status: 'started' | 'completed') => {
    // 实际项目中需要与后端同步
    console.log(`Progress updated: ${nodeId} - ${status}`)
    setProgress(prev => Math.min(prev + 0.1, 1))
  }

  return (
    <LearningContext.Provider 
      value={{ 
        treeData,
        currentNode,
        progress,
        setCurrentNode,
        updateProgress
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export const useLearning = () => {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider')
  }
  return context
}