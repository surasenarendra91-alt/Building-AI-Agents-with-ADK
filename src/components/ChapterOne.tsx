import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, HelpCircle, Check, Settings2, Wrench, 
  Terminal, ArrowRight, Lightbulb, Send, Info 
} from 'lucide-react';

interface ChapterOneProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ChapterOne({ onComplete, isCompleted }: ChapterOneProps) {
  // Config state
  const [systInst, setSystInst] = useState(
    "You are a helpful, professional coordinator. Prioritize using the weather database tool if the user asks for conditions."
  );
  const [activeTools, setActiveTools] = useState<string[]>(['get_weather']);
  const [userPrompt, setUserPrompt] = useState("Is there an umbrella required for Amsterdam today?");
  
  // Execution status
  const [simState, setSimState] = useState<'idle' | 'input' | 'thought_1' | 'tool_call' | 'tool_resp' | 'thought_2' | 'finished'>('idle');
  const [logs, setLogs] = useState<{ label: string; details: string; type: 'system' | 'agent' | 'tool' }[]>([]);

  const handleToolToggle = (tool: string) => {
    if (activeTools.includes(tool)) {
      setActiveTools(activeTools.filter(t => t !== tool));
    } else {
      setActiveTools([...activeTools, tool]);
    }
  };

  const runSimulation = () => {
    setLogs([]);
    setSimState('input');
  };

  const resetSimulation = () => {
    setSimState('idle');
    setLogs([]);
  };

  // Step sequencer
  useEffect(() => {
    if (simState === 'idle') return;

    let timer: NodeJS.Timeout;

    if (simState === 'input') {
      setLogs([{ label: 'System Ingestion', details: `User prompt received: "${userPrompt}"`, type: 'system' }]);
      timer = setTimeout(() => setSimState('thought_1'), 1600);
    } 
    else if (simState === 'thought_1') {
      const toolCheckStr = activeTools.includes('get_weather') 
        ? "I detected local temperature mentions. I should consult my 'get_weather' tool to inspect rain levels."
        : "I do not have access to any external tools to query active metrics. I must compile a general fallback answer.";

      setLogs(prev => [
        ...prev, 
        { 
          label: 'Agent Thoughts', 
          details: `Applying instructions: "${systInst.substring(0, 50)}..."\nReasoning: User request is checking for umbrellas in Amsterdam. ${toolCheckStr}`, 
          type: 'agent' 
        }
      ]);

      timer = setTimeout(() => {
        if (activeTools.includes('get_weather')) {
          setSimState('tool_call');
        } else {
          setSimState('thought_2');
        }
      }, 2000);
    } 
    else if (simState === 'tool_call') {
      setLogs(prev => [
        ...prev, 
        { 
          label: 'Tool Invocation (FunctionCall)', 
          details: `Invoking registered tool: get_weather_forecast(location="Amsterdam", unit="metric")`, 
          type: 'tool' 
        }
      ]);
      timer = setTimeout(() => setSimState('tool_resp'), 1800);
    } 
    else if (simState === 'tool_resp') {
      setLogs(prev => [
        ...prev, 
        { 
          label: 'Tool Response (ResultReceived)', 
          details: `{"location": "Amsterdam", "humidity": 82, "precipitation_ratio": 78, "summary": "Unstable, steady rain showers peaking at 2pm"}`, 
          type: 'tool' 
        }
      ]);
      timer = setTimeout(() => setSimState('thought_2'), 1800);
    } 
    else if (simState === 'thought_2') {
      const finalText = activeTools.includes('get_weather')
        ? "Yes, an umbrella is absolutely required in Amsterdam today. There is a 78% chance of active rain showers, especially peaking into the afternoon. Stay dry!"
        : "I cannot look up live weather indicators because the 'get_weather' tool is disabled. Generally in Amsterdam, carrying a compact umbrella is a wise precaution since maritime rain can occur unexpectedly. If possible, consider checking a local radar!";

      setLogs(prev => [
        ...prev, 
        { 
          label: 'Agent Final Response', 
          details: finalText, 
          type: 'agent' 
        }
      ]);
      timer = setTimeout(() => {
        setSimState('finished');
        if (!isCompleted) {
          onComplete();
        }
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [simState, activeTools, systInst, userPrompt]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="chapter-one-root">
      {/* Sidebar explanation */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            Chapter 1 Tutorial
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            The Agent Execution Loop
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            In the Google Agent Development Kit (ADK), a <strong>Single Agent</strong> is not just a direct prompt query. It operates inside an iterative execution loop known as the <strong>Reasoning-Action Loop</strong>.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">1</div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">System Instruction Boundary</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Anchors the LLM's behavioral rules, constraints, tone, and logical checklists.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">2</div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">Declarative Tools</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Functions the agent is allowed to request (such as database lookups, code execution, or email APIs).</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">3</div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">The Thought-Action Loop</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The LLM outputs thoughts first to determine if a tool call is needed, pauses for host framework tool outcomes, and compiles the final user solution.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-2.5">
            <Lightbulb className="h-4 w-4 text-indigo-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Architect Tip:</strong> Deactivating the Weather Scout tool in the interactive control forces the agent to realize it lacks data and provide a logical fallback answer. Try toggling it off to test!
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Arena Sandbox */}
      <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
        <div className="flex items-center justify-between border-b border-slate-150 pb-4 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Interactive Single-Agent Sandbox</h3>
          </div>
          {simState !== 'idle' && (
            <button 
              onClick={resetSimulation}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {simState === 'idle' ? (
          /* Editor Mode */
          <div className="mt-4 flex flex-col gap-4">
            {/* Input 1: System Instruction */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                SYSTEM INSTRUCTION
              </label>
              <textarea 
                value={systInst}
                onChange={(e) => setSystInst(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-250 leading-relaxed"
                placeholder="Declare instructions for the agent..."
              />
            </div>

            {/* Input 2: Declarative Tools */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                REGISTERED TOOLS
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div 
                  onClick={() => handleToolToggle('get_weather')}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    activeTools.includes('get_weather')
                      ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Wrench className={`h-4 w-4 ${activeTools.includes('get_weather') ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">get_weather_forecast</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Local rain, wind and humidity stats</div>
                    </div>
                  </div>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${activeTools.includes('get_weather') ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-350'}`}>
                    {activeTools.includes('get_weather') && <Check className="h-2.5 w-2.5" />}
                  </div>
                </div>

                <div className="flex opacity-50 items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2.5">
                    <Wrench className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-500">calculate_expression</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Math interpreter math logic</div>
                    </div>
                  </div>
                  <span className="rounded bg-slate-200 px-1 py-0.5 text-[8px] font-semibold text-slate-600 dark:bg-slate-800">LOCKED</span>
                </div>
              </div>
            </div>

            {/* Input 3: Prompt */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                TEST USER PROMPT
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                  placeholder="Enter custom prompt..."
                />
                <button 
                  onClick={runSimulation}
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Run Bar */}
            <div className="mt-2 text-center">
              <button 
                onClick={runSimulation}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 text-indigo-200" /> Start Agent Reasoning Loop
              </button>
            </div>
          </div>
        ) : (
          /* Execution Simulation Player */
          <div className="mt-4 flex flex-col gap-4 flex-grow justify-between">
            {/* Steps Track Visualizer */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
              <div className="flex flex-col items-center gap-1 relative">
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                  simState !== 'input' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                }`}>
                  In
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Input</span>
              </div>

              <div className="flex-grow h-0.5 mx-2 border-t border-dashed border-slate-200 dark:border-slate-800" />

              <div className="flex flex-col items-center gap-1 relative">
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                  simState === 'thought_1' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                  ['tool_call', 'tool_resp', 'thought_2', 'finished'].includes(simState) ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'border-slate-200 text-slate-400'
                }`}>
                  Th
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Think</span>
              </div>

              <div className="flex-grow h-0.5 mx-2 border-t border-dashed border-slate-200 dark:border-slate-800" />

              {activeTools.includes('get_weather') && (
                <>
                  <div className="flex flex-col items-center gap-1 relative">
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                      ['tool_call', 'tool_resp'].includes(simState) ? 'border-indigo-500 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20' :
                      ['thought_2', 'finished'].includes(simState) ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'border-slate-200 text-slate-400'
                    }`}>
                      Fn
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Tool Call</span>
                  </div>
                  <div className="flex-grow h-0.5 mx-2 border-t border-dashed border-slate-200 dark:border-slate-800" />
                </>
              )}

              <div className="flex flex-col items-center gap-1 relative">
                <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                  simState === 'thought_2' ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' :
                  simState === 'finished' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'border-slate-200 text-slate-400'
                }`}>
                  Out
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Output</span>
              </div>
            </div>

            {/* Execution Logs Frame */}
            <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-indigo-100 space-y-3.5 border border-slate-800 min-h-[220px] max-h-[280px] overflow-y-auto overflow-x-hidden">
              <div className="flex items-center gap-1.5 text-slate-400 border-b border-slate-800 pb-2">
                <Terminal className="h-3.5 w-3.5" />
                <span>ADK COMPILER EMULATOR LOGS</span>
              </div>
              <AnimatePresence>
                {logs.map((log, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-l-2 pl-3 pb-1"
                    style={{
                      borderColor: log.type === 'system' ? '#38bdf8' : log.type === 'agent' ? '#818cf8' : '#fbbf24'
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wider" style={{
                      color: log.type === 'system' ? '#38bdf8' : log.type === 'agent' ? '#818cf8' : '#fbbf24'
                    }}>
                      <span>[{log.type.toUpperCase()}] {log.label}</span>
                      <span className="text-slate-500 font-mono text-[9px]">UTC 2026-05-22</span>
                    </div>
                    <p className="mt-1 text-slate-300 whitespace-pre-line leading-relaxed">{log.details}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {simState !== 'finished' && (
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] pl-3 py-1">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span>Agent is processing context...</span>
                </div>
              )}
            </div>

            {/* Info Message */}
            <div className="rounded-xl bg-indigo-50/50 p-3.5 border border-indigo-100/60 dark:bg-indigo-950/10 dark:border-indigo-900/40 text-xs text-indigo-850 dark:text-indigo-300">
              <div className="flex gap-2">
                <Info className="h-4 w-4 shrink-0 text-indigo-500" />
                <p className="leading-relaxed">
                  Notice how the agent <strong>automatically decides</strong> whether to invoke tools based on your system instructions and query parameters. Once a tool triggers, the execution suspends, returns context parameters to the host framework, and registers output tokens.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
