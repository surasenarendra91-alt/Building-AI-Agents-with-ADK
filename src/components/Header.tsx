import { Award, BookOpen, Clock, Layers } from 'lucide-react';

interface HeaderProps {
  completedChapters: number[];
  totalChaptersCount: number;
}

export default function Header({ completedChapters, totalChaptersCount }: HeaderProps) {
  const progressPercent = Math.round((completedChapters.length / totalChaptersCount) * 100);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" id="adk-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand with design specification style */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shrink-0">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <div className="h-4 w-[1px] bg-slate-250 dark:bg-slate-700"></div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[10px] font-bold tracking-widest text-[#4f46e5] dark:text-cyan-400 uppercase">ADK ACADEMY | CODELAB</span>
            </div>
            <h1 className="font-sans text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none mt-0.5">
              ADK Coordinator & Multi-Agent Architect
            </h1>
          </div>
        </div>

        {/* Info & Progress */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Progress Bar */}
          <div className="hidden flex-col items-end gap-1 md:flex">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
              <span>Progress:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {completedChapters.length}/{totalChaptersCount} Completed
              </span>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div 
                className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Connection status corresponding to design HTML header */}
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono">ADK v2.4.0 Active</span>
          </div>

          {/* Student Status Badge */}
          <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
            Student Track
          </div>
        </div>
      </div>
    </header>
  );
}
