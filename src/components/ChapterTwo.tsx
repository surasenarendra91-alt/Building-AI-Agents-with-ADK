import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, HelpCircle, Check, ArrowRight, Library, 
  Workflow, Compass, RefreshCw, Send, CheckCircle, Award 
} from 'lucide-react';

interface ChapterTwoProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ChapterTwo({ onComplete, isCompleted }: ChapterTwoProps) {
  const [activeTab, setActiveTab] = useState<'sequential' | 'router' | 'p2p'>('sequential');
  const [packetStep, setPacketStep] = useState(0);

  // Trigger completeness upon reviewing all three tabs or checking trace.
  useEffect(() => {
    if (packetStep >= 3 && !isCompleted) {
      onComplete();
    }
  }, [packetStep]);

  const handleTabChange = (tab: 'sequential' | 'router' | 'p2p') => {
    setActiveTab(tab);
    setPacketStep(0);
  };

  const advancePacket = () => {
    setPacketStep(prev => (prev + 1) % 4);
    if (!isCompleted && packetStep === 2) {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col gap-6" id="chapter-two-root">
      {/* Introduction Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            Chapter 2 Theory
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Architectural Orchestration Frameworks
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-4xl">
            In modern AI design, single agents struggle under high operational complexity. Instead, we distribute responsibilities across multiple <strong>specialized micro-agents</strong> coordinating via structural design patterns. Selection of the right architecture influences token budgets, latency parameters, and overall system deterministic safety.
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Navigation Rail */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button
            onClick={() => handleTabChange('sequential')}
            className={`flex items-start text-left gap-3.5 rounded-xl border p-4 transition-all duration-300 ${
              activeTab === 'sequential'
                ? 'border-indigo-500 bg-indigo-50/40 text-slate-900 shadow-sm dark:bg-indigo-950/20 dark:text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <Workflow className={`h-5 w-5 shrink-0 mt-0.5 ${activeTab === 'sequential' ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-sm font-bold">1. Sequential Chain</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Linear pipelines passing outputs downstream.</div>
            </div>
          </button>

          <button
            onClick={() => handleTabChange('router')}
            className={`flex items-start text-left gap-3.5 rounded-xl border p-4 transition-all duration-300 ${
              activeTab === 'router'
                ? 'border-indigo-500 bg-indigo-50/40 text-slate-900 shadow-sm dark:bg-indigo-950/20 dark:text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <Compass className={`h-5 w-5 shrink-0 mt-0.5 ${activeTab === 'router' ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-sm font-bold">2. Router / Supervisor</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Central hubs dynamically dispatching specialists.</div>
            </div>
          </button>

          <button
            onClick={() => handleTabChange('p2p')}
            className={`flex items-start text-left gap-3.5 rounded-xl border p-4 transition-all duration-300 ${
              activeTab === 'p2p'
                ? 'border-indigo-500 bg-indigo-50/40 text-slate-900 shadow-sm dark:bg-indigo-950/20 dark:text-white'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <RefreshCw className={`h-5 w-5 shrink-0 mt-0.5 ${activeTab === 'p2p' ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-sm font-bold">3. Peer-to-Peer Review</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Self-correcting iterative discussion loops.</div>
            </div>
          </button>
        </div>

        {/* Dynamic Display Frame */}
        <div className="lg:col-span-9 flex flex-col md:grid md:grid-cols-12 gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          
          {/* Visual Canvas Block (SVG/CSS Network) */}
          <div className="md:col-span-7 flex flex-col justify-between border border-slate-100 bg-slate-50 rounded-2xl p-4 min-h-[300px] dark:border-slate-850 dark:bg-slate-950/30">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 border-b border-slate-150 pb-2.5 dark:border-slate-800">
              <span className="font-mono">INTELLIGENT ROUTE SIMULATOR</span>
              <button 
                onClick={advancePacket}
                className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-[10px] text-white hover:bg-indigo-700 transition"
              >
                <span>Step: {packetStep}/3</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>

            {/* Animation arena mapping */}
            <div className="relative flex-grow flex items-center justify-center p-4">
              {activeTab === 'sequential' && (
                /* Sequential Network Layout */
                <div className="relative flex w-full justify-between items-center max-w-[400px]">
                  {/* Pipeline Lane */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                  
                  {/* Nodes */}
                  <div className={`relative z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 0 ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">🗺️</span>
                    <span className="text-[9px] font-bold mt-1">Planner</span>
                  </div>

                  {/* Packet 1 */}
                  {packetStep === 1 && (
                    <motion.div 
                      initial={{ left: '0%' }}
                      animate={{ left: '50%' }}
                      className="absolute top-1/2 h-3.5 w-3.5 rounded-full bg-indigo-600 border border-white -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center shadow-md shadow-indigo-200"
                    />
                  )}

                  <div className={`relative z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 1 ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">🌤️</span>
                    <span className="text-[9px] font-bold mt-1">Weather</span>
                  </div>

                  {/* Packet 2 */}
                  {packetStep === 2 && (
                    <motion.div 
                      initial={{ left: '50%' }}
                      animate={{ left: '100%' }}
                      className="absolute top-1/2 h-3.5 w-3.5 rounded-full bg-indigo-600 border border-white -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center shadow-md shadow-indigo-200"
                    />
                  )}

                  <div className={`relative z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 2 ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">🎡</span>
                    <span className="text-[9px] font-bold mt-1">Activities</span>
                  </div>
                </div>
              )}

              {activeTab === 'router' && (
                /* Router Hub and Spoke Layout */
                <div className="relative h-[220px] w-full max-w-[280px]">
                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-800 z-0">
                    <line x1="50%" y1="50%" x2="15%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="85%" y2="20%" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>

                  {/* Supervisor Central Hub */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 0 ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">🧭</span>
                    <span className="text-[8px] font-bold mt-1 font-sans">Supervisor</span>
                  </div>

                  {/* Specialist A */}
                  <div className={`absolute top-[10%] left-[5%] z-15 h-12 w-12 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 1 ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20 text-pink-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-base">💳</span>
                    <span className="text-[8px] font-bold mt-0.5">Billing</span>
                  </div>

                  {/* Specialist B */}
                  <div className={`absolute top-[10%] right-[5%] z-15 h-12 w-12 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 2 ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-base">🛠️</span>
                    <span className="text-[8px] font-bold mt-0.5">DevOps</span>
                  </div>

                  {/* Packet movements */}
                  {packetStep === 1 && (
                    <motion.div 
                      initial={{ left: '50%', top: '50%' }}
                      animate={{ left: '15%', top: '20%' }}
                      className="absolute h-3 w-3 rounded-full bg-pink-500 border border-white -translate-y-1/2 -translate-x-1/2 z-20 shadow"
                    />
                  )}
                  {packetStep === 2 && (
                    <motion.div 
                      initial={{ left: '15%', top: '20%' }}
                      animate={{ left: '50%', top: '50%' }}
                      className="absolute h-3 w-3 rounded-full bg-cyan-500 border border-white -translate-y-1/2 -translate-x-1/2 z-20 shadow"
                    />
                  )}
                </div>
              )}

              {activeTab === 'p2p' && (
                /* Peer-to-Peer Dialogue Layout */
                <div className="relative flex w-full justify-between items-center max-w-[280px]">
                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-800 z-0">
                    <path d="M 40,110 Q 140,50 240,110" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M 240,110 Q 140,170 40,110" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>

                  {/* Dev Node */}
                  <div className={`relative z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 0 || packetStep === 2 ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">💻</span>
                    <span className="text-[9px] font-bold mt-1 font-sans">Dev</span>
                  </div>

                  {/* Packet moving A -> B */}
                  {packetStep === 1 && (
                    <motion.div 
                      initial={{ left: '10%' }}
                      animate={{ left: '90%' }}
                      className="absolute top-1/3 h-3.5 w-3.5 rounded-full bg-purple-500 border border-white -translate-y-1/2 -translate-x-1/2 z-20 shadow"
                    />
                  )}

                  {/* Packet moving B -> A */}
                  {packetStep === 3 && (
                    <motion.div 
                      initial={{ left: '90%' }}
                      animate={{ left: '10%' }}
                      className="absolute top-2/3 h-3.5 w-3.5 rounded-full bg-orange-500 border border-white -translate-y-1/2 -translate-x-1/2 z-20 shadow"
                    />
                  )}

                  {/* QA Node */}
                  <div className={`relative z-15 h-14 w-14 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                    packetStep === 1 || packetStep === 3 ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/40 text-orange-700' : 'border-slate-200 bg-white text-slate-400'
                  }`}>
                    <span className="text-lg">🔍</span>
                    <span className="text-[9px] font-bold mt-1 font-sans">QA Expert</span>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated narration block */}
            <div className="bg-white rounded-xl p-3 border border-slate-150 dark:bg-slate-900 dark:border-slate-800 text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
              <strong className="text-slate-900 dark:text-white">Active Step {packetStep}: </strong>
              {activeTab === 'sequential' && (
                packetStep === 0 ? "Seattle Coordinator initializes the travel design layout." :
                packetStep === 1 ? "File packet outputs are transmitted downstream to Weather Scout." :
                packetStep === 2 ? "Weather alerts are parsed by Experience Optimizer to construct rainy options." :
                "Process finalized! Ready for a brand new trace run."
              )}
              {activeTab === 'router' && (
                packetStep === 0 ? "Supervisor evaluates incoming client query context." :
                packetStep === 1 ? "Hub dispatches billing credentials lookup trigger." :
                packetStep === 2 ? "Specialists report logs diagnostic arrays back to center desk." :
                "Compiled final results delivered."
              )}
              {activeTab === 'p2p' && (
                packetStep === 0 ? "Software Dev produces clean code snippets." :
                packetStep === 1 ? "Draft code reaches QA Analyst for simulation tests." :
                packetStep === 2 ? "QA agent flags leak alerts; Dev Agent updates structure." :
                "Tests approved! Feedback loops closed cleanly."
              )}
            </div>
          </div>

          {/* Theory / Description Block */}
          <div className="md:col-span-5 flex flex-col justify-between py-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white capitalize">
                  {activeTab} Orchestration Pattern
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {activeTab === 'sequential' && "Perfect for linear pipelines where each persona specializes on a subsequent stage. Outputs act as inputs for peers downstream."}
                  {activeTab === 'router' && "Excellent for dispatching tickets across complex multi-service centers. Isolates execution contexts to specific agents, increasing accuracy."}
                  {activeTab === 'p2p' && "Excellent for self-correcting routines. A critique feedback loop iterates on outputs (e.g., Code Review or Content Editing) until quality checks pass."}
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">Optimal Use-Case</span>
                <p className="text-xs text-slate-800 dark:text-slate-200">
                  {activeTab === 'sequential' && "Document generation, weather-adjusted itinerary builders, reporting sweeps."}
                  {activeTab === 'router' && "Large client desks, CRM ticketing hubs, multi-database query routers."}
                  {activeTab === 'p2p' && "Autonomous software engineering, document drafting + editorial review loops."}
                </p>
              </div>

              <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">Google ADK Class Mapping</span>
                <code className="block rounded bg-slate-50 p-2 text-[10px] font-mono text-indigo-700 dark:bg-slate-950 dark:text-cyan-400">
                  {activeTab === 'sequential' && "import { AgentPipeline } from '@google/genai';"}
                  {activeTab === 'router' && "import { TaskSupervisor } from '@google/genai';"}
                  {activeTab === 'p2p' && "import { CollaborativeTeam } from '@google/genai';"}
                </code>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <CheckCircle className="h-4 w-4" /> Theory Verified! Continue to Chapter 3.
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  *Trace message packets using the step controller above to verify this theory.*
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
