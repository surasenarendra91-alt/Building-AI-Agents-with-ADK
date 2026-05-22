import { useState } from 'react';
import { 
  Code, Sliders, Check, Copy, CheckCircle, Info, 
  Terminal, ArrowRight, Lightbulb 
} from 'lucide-react';
import { CODE_EXPLORER_TABS } from '../data/codelabData';

interface ChapterFourProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ChapterFour({ onComplete, isCompleted }: ChapterFourProps) {
  const [activeTabId, setActiveTabId] = useState<'single_agent' | 'registering_tools' | 'sequential_pipeline' | 'router_dispatch'>('single_agent');
  
  // Custom interactive parameters
  const [agentName, setAgentName] = useState("SeattlePlanner");
  const [systemInstruction, setSystemInstruction] = useState("Draft clean 3-day Seattle itineraries with safety warning thresholds.");
  const [temperature, setTemperature] = useState<number>(0.7);

  const [copied, setCopied] = useState(false);

  const activeTab = CODE_EXPLORER_TABS.find(t => t.id === activeTabId)!;

  // Render the current dynamic code string
  const renderCode = () => {
    return activeTab.code(agentName, systemInstruction, temperature);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Auto complete when student copies block
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="chapter-four-root">
      
      {/* Parameter Control Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            Chapter 4 Code Generator
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white font-sans">
            ADK Boilerplate Generator
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Customize parameters in real-time below and watch the Google ADK (Agent Development Kit) code blocks regenerate dynamically.
          </p>

          <div className="mt-5 space-y-4">
            {/* Input Name */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Agent Identifier Name</label>
              <input 
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>

            {/* Input System Instruction */}
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">System instructions (Strict System bounds)</label>
              <textarea 
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-mono focus:outline-none focus:border-indigo-500 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-350"
              />
            </div>

            {/* Input Temperature */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Temperature (creativity index)</label>
                <span className="text-[10.5px] font-mono font-bold text-slate-950 dark:text-white">{temperature}</span>
              </div>
              <input 
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
                <span>0.0 (Strict / Safe)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational tip */}
        <div className="mt-6 rounded-xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-950/40 dark:border-slate-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-indigo-500" />
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Google ADK abstracts raw payload REST operations into unified class controllers like <code>AgentPipeline</code> and <code>TaskSupervisor</code>, keeping your business logic clean.
            </p>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel on the right */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
        <div>
          {/* Section Menu Bar */}
          <div className="flex flex-wrap gap-1 border-b border-slate-200/60 pb-3 dark:border-slate-800/80">
            {CODE_EXPLORER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id as any)}
                className={`text-[10.5px] font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                  activeTabId === tab.id
                    ? 'bg-slate-900 text-white dark:bg-slate-750'
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans px-1">
            {activeTab.description}
          </p>

          {/* Dynamic Code frame */}
          <div className="relative mt-4 bg-slate-950 rounded-2xl border border-slate-850 p-4 font-mono text-xs text-indigo-100 min-h-[240px] select-text">
            {/* Action copy button */}
            <button 
              onClick={handleCopy}
              className="absolute right-3 top-3 flex items-center justify-center h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:text-indigo-200 transition text-[10.5px] font-sans border border-white/5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400 shrink-0" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" /> Copy
                </>
              )}
            </button>

            <pre className="overflow-x-auto whitespace-pre leading-relaxed py-2 pl-0 text-slate-300">
              <code>{renderCode()}</code>
            </pre>
          </div>
        </div>

        {/* Playback Completion Indicator */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold">
          <span className="text-slate-400">STATUS: REPOSITORY SOURCE CODE RECOVERY</span>
          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-600 uppercase">
              <CheckCircle className="h-3.5 w-3.5" /> Source code extracted!
            </span>
          ) : (
            <span className="text-amber-500">
              *Copy the code snippet to mark this chapter complete.*
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
