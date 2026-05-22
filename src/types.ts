export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  systemInstruction: string;
  tools: string[];
  status: 'idle' | 'thinking' | 'calling_tool' | 'done';
  color: string;
}

export interface Tool {
  name: string;
  description: string;
  schema: string;
}

export interface SimulationMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  type: 'agent_thought' | 'agent_msg' | 'tool_call' | 'tool_response' | 'system';
  timestamp: string;
  toolName?: string;
  toolArgs?: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  duration: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SandboxScenario {
  id: string;
  title: string;
  description: string;
  architecture: 'sequential' | 'router' | 'p2p';
  initialPrompt: string;
  agents: Agent[];
  steps: {
    sender: string;
    receiver: string;
    type: 'agent_thought' | 'agent_msg' | 'tool_call' | 'tool_response' | 'system';
    content: string;
    toolName?: string;
    toolArgs?: string;
  }[];
}
