// CodeBlock.tsx
"use client";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// 这里可以任选一个主题，比如 oneDark、vscDarkPlus、atomDark 等
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export default function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // 使用浏览器的 Clipboard API 复制文本
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒后恢复按钮文字
  };
  console.log(oneDark);

  return (
    <div className="relative group">
      {/* 显示语言 */}
      {language && (
        <span className="absolute top-2 left-2 text-xs text-gray-500">
          {language}
        </span>
      )}
      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className={`
          absolute
          top-2
          right-2
          rounded
          ${copied ? "bg-green-300" : "bg-gray-200"}
          px-2
          py-1
          text-xs
          text-black
          shadow
          ${copied ? "bg-green-300" : "bg-gray-300"}
          focus:outline-none
          
        `}
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* 代码高亮 */}
      
      
      <SyntaxHighlighter
          language={language}
          showLineNumbers
          style={oneDark}
          customStyle={{ paddingTop: '2.5em' }}
        >
          {value}
      </SyntaxHighlighter>
      
    </div>
  );
}
