import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Award, CheckCircle2, ArrowRight, ArrowLeft, 
  User, GitMerge, Play, Code, Flag, Sparkles 
} from 'lucide-react';

import Header from './components/Header';
import ChapterOne from './components/ChapterOne';
import ChapterTwo from './components/ChapterTwo';
import ChapterThree from './components/ChapterThree';
import ChapterFour from './components/ChapterFour';
import ChapterFive from './components/ChapterFive';
import { CHAPTERS } from './data/codelabData';

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [certReady, setCertReady] = useState<boolean>(false);

  // Sync state with finished tracks offline
  useEffect(() => {
    const saved = localStorage.getItem('adk_codelab_progress');
    if (saved) {
      try {
        setCompletedChapters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress cache", e);
      }
    }
  }, []);

  const handleMarkComplete = (id: number) => {
    if (completedChapters.includes(id)) return;
    const updated = [...completedChapters, id];
    setCompletedChapters(updated);
    localStorage.setItem('adk_codelab_progress', JSON.stringify(updated));

    if (id === 5) {
      setCertReady(true);
    }
  };

  const handleNextChapter = () => {
    if (activeChapterId < CHAPTERS.length) {
      setActiveChapterId(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterId > 1) {
      setActiveChapterId(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getChapterIcon = (name: string, isActive: boolean) => {
    const baseStyle = isActive ? "text-indigo-600 dark:text-cyan-400" : "text-slate-400";
    switch (name) {
      case 'User': return <User className={`h-4.5 w-4.5 ${baseStyle}`} />;
      case 'GitMerge': return <GitMerge className={`h-4.5 w-4.5 ${baseStyle}`} />;
      case 'Play': return <Play className={`h-4.5 w-4.5 ${baseStyle}`} />;
      case 'Code': return <Code className={`h-4.5 w-4.5 ${baseStyle}`} />;
      case 'Award': return <Award className={`h-4.5 w-4.5 ${baseStyle}`} />;
      default: return <BookOpen className={`h-4.5 w-4.5 ${baseStyle}`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/65 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col" id="app-viewport">
      <Header completedChapters={completedChapters} totalChaptersCount={CHAPTERS.length} />

      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6" id="main-content">
        
        {/* Course Roadmap Nav Rail & Dynamic content container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start" id="arena-grid">
          
          {/* Sidebar Nav rail - Professional Polish Dark Style */}
          <div className="lg:col-span-3 flex flex-col gap-4 sticky top-20 print:hidden" id="navigation-rail">
            <div className="rounded-2xl border border-slate-950 bg-slate-900 text-slate-300 p-5 shadow-xl dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-4">CODELAB ROADMAP</span>
              
              <div className="space-y-1.5">
                {CHAPTERS.map((chap, idx) => {
                  const isActive = activeChapterId === chap.id;
                  const isVerified = completedChapters.includes(chap.id);

                  return (
                    <button
                      key={chap.id}
                      onClick={() => setActiveChapterId(chap.id)}
                      className={`w-full flex items-center justify-between text-left p-3 rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                          : 'border-slate-800/60 bg-slate-950/20 text-slate-450 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-mono text-[11.5px] font-semibold w-5 shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-600'}`}>
                          0{chap.id}
                        </span>
                        <span className="text-xs font-semibold leading-tight font-sans truncate pr-1">
                          {chap.title.replace(/^\d+\.\s*/, '')}
                        </span>
                      </div>
                      
                      {isVerified ? (
                        <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 ml-1.5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                      ) : (
                        <span className={`text-[9.5px] font-mono shrink-0 font-bold tracking-tight ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {chap.duration}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic bottom progress indicator from design specifications */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2 text-slate-400">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-500">Progress</span>
                  <span className="font-mono font-bold text-white">
                    {Math.round((completedChapters.length / CHAPTERS.length) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.round((completedChapters.length / CHAPTERS.length) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick action cache reset */}
            {completedChapters.length > 0 && (
              <button
                onClick={() => {
                  setCompletedChapters([]);
                  localStorage.removeItem('adk_codelab_progress');
                  setActiveChapterId(1);
                  setCertReady(false);
                }}
                className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors py-1 cursor-pointer"
              >
                Reset Progress Cache Offline
              </button>
            )}
          </div>

          {/* Chapter Content Arena */}
          <div className="lg:col-span-9 flex flex-col gap-6" id="chapter-viewport">
            {/* Active Chapter header indicators */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight dark:text-white">
                {CHAPTERS[activeChapterId - 1].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {CHAPTERS[activeChapterId - 1].subtitle}
              </p>
            </div>

            {/* Render Component */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapterId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {activeChapterId === 1 && (
                  <ChapterOne 
                    onComplete={() => handleMarkComplete(1)} 
                    isCompleted={completedChapters.includes(1)} 
                  />
                )}
                {activeChapterId === 2 && (
                  <ChapterTwo 
                    onComplete={() => handleMarkComplete(2)} 
                    isCompleted={completedChapters.includes(2)} 
                  />
                )}
                {activeChapterId === 3 && (
                  <ChapterThree 
                    onComplete={() => handleMarkComplete(3)} 
                    isCompleted={completedChapters.includes(3)} 
                  />
                )}
                {activeChapterId === 4 && (
                  <ChapterFour 
                    onComplete={() => handleMarkComplete(4)} 
                    isCompleted={completedChapters.includes(4)} 
                  />
                )}
                {activeChapterId === 5 && (
                  <ChapterFive 
                    onComplete={() => handleMarkComplete(5)} 
                    isCompleted={completedChapters.includes(5)} 
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Navigation flow controllers */}
            <div className="flex items-center justify-between mt-4 border-t border-slate-200/80 pt-6 dark:border-slate-800 print:hidden">
              <button
                onClick={handlePrevChapter}
                disabled={activeChapterId === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-900 disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Previous Chapter
              </button>

              <div className="text-xs font-mono font-bold text-slate-400">
                MODULE {activeChapterId} OF {CHAPTERS.length}
              </div>

              {activeChapterId < CHAPTERS.length ? (
                <button
                  onClick={handleNextChapter}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow cursor-pointer shadow-indigo-100 dark:shadow-none"
                >
                  Next Chapter <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 font-sans">
                  <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" /> Certified ADK Architect!
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
