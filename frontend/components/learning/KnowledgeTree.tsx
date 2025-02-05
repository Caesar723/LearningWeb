"use client"


import { useState, useEffect } from "react"
import Tree from "react-d3-tree"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
import { Message, RootNode, KnowledgeNode, LeaveNode } from "@/lib/types"


interface KnowledgeTreeProps {
  currentNode: string | null
  setCurrentNode: (node: string) => void
  currentLearningSpace: Message[] | null
  setCurrentLearningSpace: (space: Message[]) => void
}

export default function KnowledgeTree({ currentNode, setCurrentNode }: KnowledgeTreeProps) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const treeContainer = document.getElementById("treeWrapper")
    if (treeContainer) {
      setTranslate({ x: treeContainer.clientWidth / 2, y: treeContainer.clientHeight / 2 })
    }
  }, [])

  // This is a mock tree structure. In a real application, this would be generated dynamically.
  const treeData = {
    name: "Root Concept",
    children: [
      {
        name: "Sub Concept 1",
        children: [{ name: "Topic 1.1" }, { name: "Topic 1.2" }],
      },
      {
        name: "Sub Concept 2",
        children: [{ name: "Topic 2.1" }, { name: "Topic 2.2" }],
      },
    ],
  }

  const customNodeRenderer = ({ nodeDatum, toggleNode }: any) => (
    <g>
      <circle 
        r={10} 
        fill={(() => {
          if (currentNode === nodeDatum.name) {
            return "#3B82F6"
          } else if (nodeDatum.children && nodeDatum.children.some((child: any) => child.name === currentNode)) {
            return "#93C5FD"
          } else if (nodeDatum.children && nodeDatum.children.some((child: any) => child.children && child.children.some((grandchild: any) => grandchild.name === currentNode))) {
            return "#B3E5FC"
          } else {
            return "#9CA3AF"
          }
        })()}
        onClick={() => setCurrentNode(nodeDatum.name)

        } />
      <text
        
        fill={(() => {
          if (currentNode === nodeDatum.name) {
            return "#3B82F6"
          } else if (nodeDatum.children && nodeDatum.children.some((child: any) => child.name === currentNode)) {
            return "#3B82F6"
          } else if (nodeDatum.children && nodeDatum.children.some((child: any) => child.children && child.children.some((grandchild: any) => grandchild.name === currentNode))) {
            return "#3B82F6"
          } else {
            return "#9CA3AF"
          }
        })()}
        strokeWidth="5.5"
        stroke="currentColor"
        
        strokeLinejoin="round"
        x={nodeDatum.children ? "-20" : "20"}
        y="5"
        r="10"
        fillOpacity={1}
        onClick={(e) => {
          
          if (!nodeDatum.children || nodeDatum.children.length === 0) {
            setCurrentNode(nodeDatum.name)
          }
        }}
        className="text-sm dark:text-gray-800 text-gray-100"
        textAnchor={nodeDatum.children ? "end" : "start"}
        paintOrder="stroke"
        
      >
        {nodeDatum.name}
      </text>
      <path d={`M0,0 L-10,0`} stroke="transparent" pointerEvents="none" />
    </g>
  )

  return (
    <div className="h-64 w-full bg-white dark:bg-gray-800" id="treeWrapper">
      <Tree
        data={treeData}
        translate={translate}
        nodeSize={{ x: 200, y: 50 }}
        renderCustomNodeElement={customNodeRenderer}
        orientation="horizontal"
        pathFunc="diagonal"
        separation={{ siblings: 1, nonSiblings: 1 }}
        pathClassFunc={() => "stroke-gray-800 dark:stroke-gray-200"}
      />
    </div>
  )
}
