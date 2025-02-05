// ChatBox.tsx
"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock";

// 定义消息类型
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ChatBoxProps {
  messages: ChatMessage[];
  title?: string;
}

export function ChatBox({ messages, title = "AI Chat" }: ChatBoxProps) {
  // 根据角色返回不同样式
  const getMessageClasses = (role: "user" | "assistant") => {
    return role === "assistant"
      ? "bg-gray-50 text-black self-start"
      : "bg-blue-50 text-black self-end";
  };

  return (
    <div className="w-full flex justify-center p-6">
      <Card className="w-full flex flex-col">
        <CardHeader className="flex flex-row items-center">
          {/* 可替换为自己的 AI 图标或 Avatar */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M512 32C264.64 32 64 232.64 64 480c0 247.36 200.64 448 448 448s448-200.64 448-448C960 232.64 759.36 32 512 32zm0 810.67c-200.53 0-362.67-162.13-362.67-362.67 0-200.53 162.13-362.67 362.67-362.67 200.53 0 362.67 162.13 362.67 362.67 0 200.53-162.13 362.67-362.67 362.67z"
              fill="#4C8BF5"
            />
            <text
              x="50%"
              y="50%"
              fill="currentColor"
              className="text-black dark:text-white"
              fontSize="400"
              textAnchor="middle"
              alignmentBaseline="central"
              fontWeight="bold"
            >
              AI
            </text>
          </svg>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-auto px-4 py-4">
            <div className="flex flex-col items-stretch justify-center space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-md mb-10 p-3 whitespace-pre-wrap max-w-[80%] self-center ${getMessageClasses(
                    msg.role
                  )}`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    
                
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        // 尝试从 className (如 "language-js") 中提取语言名称
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        //console.log(node, inline, className, children, props);
                        // 将 children 转为字符串；有时它是字符串数组，所以做一次 String(children) 处理
                        const codeContent = String(children).replace(/\n$/, "");
              
                        // 如果是行内代码，就按默认渲染；否则使用我们自定义的 <CodeBlock> 组件
                        return inline ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <CodeBlock language={language} value={codeContent} />
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
