import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, FastForward, RotateCcw, Cpu, Users, 
  Terminal, ShieldCheck, HelpCircle, ChevronRight, Sliders, Info, CheckCircle2 
} from 'lucide-react';
import { SCENARIOS } from '../data/codelabData';
import { SandboxScenario, SimulationMessage, Agent } from '../types';

interface ChapterThreeProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ChapterThree({ onComplete, isCompleted }: ChapterThreeProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<'sequential_trip' | 'routed_support' | 'p2p_dev'>('sequential_trip');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<1000 | 2000 | 3000>(2000);
  
  // Load scenario state
  const [scenario, setScenario] = useState<SandboxScenario>(
    JSON.parse(JSON.stringify(SCENARIOS.find(s => s.id === 'sequential_trip')!))
  );

  const [promptInput, setPromptInput] = useState(scenario.initialPrompt);
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [activeAgents, setActiveAgents] = useState<Agent[]>(scenario.agents);

  // Live Statistics
  const [totalTokens, setTotalTokens] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset/sync when scenario changes
  useEffect(() => {
    const raw = SCENARIOS.find(s => s.id === selectedScenarioId)!;
    const cloned = JSON.parse(JSON.stringify(raw)) as SandboxScenario;
    setScenario(cloned);
    setPromptInput(cloned.initialPrompt);
    resetSimulation(cloned);
  }, [selectedScenarioId]);

  // Handle step-by-step simulation running
  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex >= scenario.steps.length) {
        setIsPlaying(false);
        if (!isCompleted) {
          onComplete(); // Certified sandbox trial complete!
        }
        return;
      }

      stepTimerRef.current = setTimeout(() => {
        executeNextStep();
      }, simulationSpeed);
    } else {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    }

    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [isPlaying, currentStepIndex]);

  const resetSimulation = (targetScenario = scenario) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setMessages([]);
    setTotalTokens(0);
    setLatencyMs(0);
    
    // Reset all status to idle
    const cleanAgents = targetScenario.agents.map(a => ({
      ...a,
      status: 'idle' as const
    }));
    setActiveAgents(cleanAgents);
  };

  const executeNextStep = () => {
    if (currentStepIndex >= scenario.steps.length) {
      setIsPlaying(false);
      if (!isCompleted) {
        onComplete();
      }
      return;
    }

    const nextStep = scenario.steps[currentStepIndex];
    
    // Create actual simulated log item
    const newMsg: SimulationMessage = {
      id: `step_${currentStepIndex}`,
      sender: nextStep.sender,
      receiver: nextStep.receiver,
      content: nextStep.content,
      type: nextStep.type,
      timestamp: new Date().toISOString(),
      toolName: nextStep.toolName,
      toolArgs: nextStep.toolArgs
    };

    setMessages(prev => [...prev, newMsg]);

    // Update stats
    setTotalTokens(prev => prev + Math.floor(Math.random() * 250) + 150);
    setLatencyMs(prev => prev + Math.floor(Math.random() * 400) + 300);

    // Update agent status states
    const updatedAgents = activeAgents.map(agent => {
      if (agent.id === nextStep.sender) {
        // Active node status trigger
        if (nextStep.type === 'agent_thought') return { ...agent, status: 'thinking' as const };
        if (nextStep.type === 'tool_call') return { ...agent, status: 'calling_tool' as const };
        return { ...agent, status: 'done' as const };
      }
      if (agent.id === nextStep.receiver && nextStep.type === 'agent_msg') {
        return { ...agent, status: 'thinking' as const };
      }
      return { ...agent, status: 'idle' as const };
    });

    setActiveAgents(updatedAgents);
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleAgentInstructionChange = (id: string, newInstruction: string) => {
    const updated = activeAgents.map(a => 
      a.id === id ? { ...a, systemInstruction: newInstruction } : a
    );
    setActiveAgents(updated);
  };

  return (
    <div className="flex flex-col gap-6" id="arena-root">
      {/* Intro Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
              Chapter 3 Arena Playground
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              The Multi-Agent Orchestration Arena
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
              Pick a real coordination choreography scenario, tune agent system controls, and launch the asynchronous debug playback.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedScenarioId('sequential_trip')}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                selectedScenarioId === 'sequential_trip'
                  ? 'border-indigo-500 bg-indigo-550 text-white shadow dark:bg-indigo-650'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350'
              }`}
            >
              🏕️ Trip Planner
            </button>
            <button
              onClick={() => setSelectedScenarioId('routed_support')}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                selectedScenarioId === 'routed_support'
                  ? 'border-indigo-500 bg-indigo-550 text-white shadow dark:bg-indigo-650'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350'
              }`}
            >
              ⚡ Ticket Triage
            </button>
            <button
              onClick={() => setSelectedScenarioId('p2p_dev')}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                selectedScenarioId === 'p2p_dev'
                  ? 'border-indigo-500 bg-indigo-550 text-white shadow dark:bg-indigo-650'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-350'
              }`}
            >
              🤖 Code QA Review
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side: Agent Config & Controls */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Simulation Controllers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">PLAYBACK SYSTEM OPTIONS</h3>
            
            <div className="mt-3 space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PROMPT USER INSTRUCTION</label>
                <input 
                  type="text" 
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Step Controls */}
              <div className="flex gap-2">
                {isPlaying ? (
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="flex-grow flex items-center justify-center gap-1.5 rounded-xl border border-amber-350 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                  >
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="flex-grow flex items-center justify-center gap-1.5 rounded-xl bg-indigo-650 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    <Play className="h-3.5 w-3.5 text-indigo-200" /> Auto run
                  </button>
                )}

                <button 
                  onClick={executeNextStep}
                  disabled={isPlaying || currentStepIndex >= scenario.steps.length}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950 disabled:opacity-40"
                  title="Forward single task slice"
                >
                  <FastForward className="h-3.5 w-3.5" />
                </button>

                <button 
                  onClick={() => resetSimulation()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                  title="Reset Arena logs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">SIMULATION SPEED</span>
                <div className="flex gap-1.5">
                  {[3000, 2000, 1000].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimulationSpeed(speed as any)}
                      className={`text-[9.5px] font-bold px-2 py-1 rounded ${
                        simulationSpeed === speed
                          ? 'bg-slate-900 text-white dark:bg-slate-750'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      {speed === 3000 ? 'Slow' : speed === 2000 ? '1x' : '2x'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Specialized Agents configuration */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex-grow">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="h-4 w-4 text-slate-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Micro-Agent Tuner</h3>
            </div>
            
            <div className="space-y-4">
              {activeAgents.map((agent) => (
                <div key={agent.id} className="border-b border-dashed border-slate-100 pb-3 dark:border-slate-800 last:border-none last:pb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{agent.avatar}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-150 block leading-tight">{agent.name}</span>
                        <span className="text-[9px] text-slate-400 block">{agent.role}</span>
                      </div>
                    </div>
                    {/* Status badge */}
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tight ${
                      agent.status === 'thinking' ? 'bg-amber-100/70 text-amber-700 animate-pulse dark:bg-amber-950/25 dark:text-amber-400' :
                      agent.status === 'calling_tool' ? 'bg-cyan-100/70 text-cyan-700 dark:bg-cyan-950/25 dark:text-cyan-400' :
                      agent.status === 'done' ? 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/25 dark:text-emerald-400' :
                      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <label className="text-[9px] font-mono font-bold text-indigo-500 block mb-1">SYSTEM INSTRUCTION</label>
                  <textarea
                    value={agent.systemInstruction}
                    onChange={(e) => handleAgentInstructionChange(agent.id, e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-slate-150 bg-slate-50/50 p-2 text-[10px] focus:outline-none focus:border-indigo-500 font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Debug Monitor */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Metadata board */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                <Users className="h-4.5 w-4.5 text-indigo-600 dark:text-cyan-400" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block leading-none font-bold uppercase">PERSONAS</span>
                <span className="font-sans font-bold text-sm text-slate-900 mt-0.5 block dark:text-white">{activeAgents.length} Agents</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                <Cpu className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block leading-none font-bold uppercase">TOKEN BUDGET</span>
                <span className="font-mono font-bold text-sm text-slate-900 mt-0.5 block dark:text-white">{totalTokens.toLocaleString()} tokens</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center">
                <Terminal className="h-4.5 w-4.5 text-pink-600" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block leading-none font-bold uppercase">SIMULATOR STATE</span>
                <span className="font-sans font-bold text-xs text-slate-900 mt-0.5 block dark:text-white capitalize truncate">
                  {currentStepIndex === scenario.steps.length ? 'Success ✅' : `${currentStepIndex}/${scenario.steps.length} Steps`}
                </span>
              </div>
            </div>
          </div>

          {/* Core Arena simulation terminal output */}
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-sm border-slate-850 flex-grow flex flex-col justify-between min-h-[440px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="font-mono text-xs text-indigo-400 tracking-wider font-bold">ORCHESTRATOR INTERFACES ENGINE</span>
              </div>
              <span className="font-mono text-[9px] text-slate-500">CODELAB CONTEXT VERIFIED</span>
            </div>

            {/* In-Arena visual simulation lines */}
            <div className="flex-grow overflow-y-auto max-h-[380px] space-y-4 pr-1.5 select-text">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="h-[280px] flex flex-col items-center justify-center text-center">
                    <span className="text-4xl filter grayscale mb-2">🚥</span>
                    <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Simulation Ready</h4>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[280px] font-mono">
                      Click "Auto run" or execute step clicks to watch the agent-to-agent coordination.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const lookupAgent = activeAgents.find(a => a.id === msg.sender);
                    const isSystem = msg.type === 'system';
                    const isToolCall = msg.type === 'tool_call';
                    const isToolResp = msg.type === 'tool_response';
                    const isThought = msg.type === 'agent_thought';

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-xl border font-mono text-xs leading-relaxed ${
                          isSystem ? 'bg-indigo-950/20 border-indigo-900/30 text-indigo-300' :
                          isToolCall ? 'bg-amber-950/20 border-amber-900/30 text-amber-200' :
                          isToolResp ? 'bg-cyan-955/20 border-cyan-900/30 text-cyan-200' :
                          isThought ? 'bg-slate-900/80 border-slate-800 text-slate-350' :
                          'bg-slate-900/40 border-slate-850 text-slate-100'
                        }`}
                      >
                        {/* Header metadata row */}
                        <div className="flex items-center justify-between border-b border-white/[0.04] pb-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {lookupAgent ? (
                              <span className="text-sm">{lookupAgent.avatar}</span>
                            ) : (
                              <span className="text-sm">🎛️</span>
                            )}
                            <span className="font-bold underline text-[10.5px]">
                              {isSystem ? 'SYSTEM' : isToolCall || isToolResp ? 'EXTERNAL API TOOL' : lookupAgent?.name || msg.sender}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                            {msg.type.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Event action body details */}
                        <p className="whitespace-pre-line">{msg.content}</p>

                        {/* Tool block arguments details wrapper */}
                        {isToolCall && msg.toolName && (
                          <div className="mt-2 rounded bg-black/40 p-2 border border-white/5 text-[10px] tracking-tight">
                            <span className="text-amber-500 font-bold block">NAME: {msg.toolName}</span>
                            <span className="text-slate-400 font-medium block mt-0.5">ARGS: {msg.toolArgs}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Playback Progress Checker */}
            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-bold">
              <div className="text-slate-500">
                SCENE COMPLETE INDICATOR: {currentStepIndex}/{scenario.steps.length} SLEEVES
              </div>
              {currentStepIndex === scenario.steps.length ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> PLAYBACK APPROVED
                </div>
              ) : (
                <div className="text-indigo-400 animate-pulse uppercase tracking-wider">
                  WAITING FOR EXECUTION RUNS
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
