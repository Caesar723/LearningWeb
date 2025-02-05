// 基础用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  // 学习相关扩展字段
  learningPreferences?: {
    
    preferredLanguage: 'en' | 'zh';
  };
  // 认证相关字段
  emailVerified?: boolean;
}

// 认证响应类型
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// 用户更新资料请求类型
export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
  learningPreferences?: Partial<User['learningPreferences']>;
}

// 会话类型（扩展之前的Session）
export interface Session {
  user: User | null;
  expires: string;
  accessToken?: string;
}

// 知识节点类型（已存在的补充）
export interface RootNode {
  id: string;//id generate by server depend on user
  name: string;
  children?: KnowledgeNode[];
}
export interface KnowledgeNode {
  name: string;
  children?: LeaveNode[];
}
export interface LeaveNode {
  id: string;// This is different from the id in the root node is refer to the message id
  name: string;
  difficulty: number;
}

// 测验类型（保持原有）
export interface QuizSelection {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  leaveid: string | null
}

export interface QuizText {
  question: string;
  answer: string;
  explanation?: string;
  leaveid: string | null
}

export interface Message {
  role: string
  content: string
  index_question: number | null
  leaveid: string | null
}

