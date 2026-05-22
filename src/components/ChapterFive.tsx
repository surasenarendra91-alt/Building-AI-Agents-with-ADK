import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, HelpCircle, Check, X, ArrowRight, RotateCcw, 
  Printer, CheckCircle2, ShieldAlert, Sparkles, BookOpen 
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/codelabData';

interface ChapterFiveProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export default function ChapterFive({ onComplete, isCompleted }: ChapterFiveProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("Narendra Surase");
  const [customCertId] = useState(`ADK-2026-05-22-${Math.floor(Math.random() * 90000) + 10000}`);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex
    });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Auto complete if score >= 3
    if (calculateScore() >= 3) {
      onComplete();
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const score = calculateScore();
  const passed = score >= 3;

  return (
    <div className="flex flex-col gap-6" id="chapter-five-root">
      
      {/* Quiz Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 print:hidden">
        
        {/* Quiz questions space */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-600 dark:text-cyan-400" />
              <h3 className="text-base font-bold text-slate-950 dark:text-white">Orchestration Architectural Audits</h3>
            </div>
            {quizSubmitted && (
              <button 
                onClick={handleResetQuiz}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <RotateCcw className="h-3 w-3" /> Reset Quiz
              </button>
            )}
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOption = userAnswers[q.id];
              const isCorrect = selectedOption === q.correctAnswer;

              return (
                <div key={q.id} className="border-b border-slate-100 pb-5 dark:border-slate-800/80 last:border-none last:pb-0">
                  <span className="text-[10px] font-mono font-bold text-indigo-555 uppercase tracking-wider block">Question {idx + 1} of 4</span>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{q.question}</p>
                  
                  {/* Options */}
                  <div className="mt-3.5 space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedOption === oIdx;
                      const showFeedback = quizSubmitted;

                      let optionStyle = 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300';
                      if (isOptionSelected) {
                        optionStyle = 'border-indigo-500 bg-indigo-50/50 text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200 font-medium';
                      }

                      if (showFeedback) {
                        if (oIdx === q.correctAnswer) {
                          optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-300 font-medium';
                        } else if (isOptionSelected) {
                          optionStyle = 'border-rose-450 bg-rose-50/40 text-rose-950 dark:bg-rose-950/20 dark:text-rose-350';
                        }
                      }

                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs transition cursor-pointer leading-normal ${optionStyle}`}
                        >
                          <div className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                            isOptionSelected ? 'border-indigo-650 text-indigo-750' : 'border-slate-350 text-slate-450'
                          } ${showFeedback && oIdx === q.correctAnswer ? 'border-emerald-650 bg-emerald-500 text-white' : ''}`}>
                            {showFeedback && oIdx === q.correctAnswer ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <span className="text-[9px] font-bold font-mono uppercase">{['A', 'B', 'C', 'D'][oIdx]}</span>
                            )}
                          </div>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback explanation details */}
                  {quizSubmitted && (
                    <div className={`mt-3 rounded-xl p-3 text-xs leading-normal font-mono ${
                      isCorrect 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-950/40 dark:text-emerald-300' 
                        : 'bg-rose-50 text-rose-800 border border-rose-100 dark:bg-rose-950/10 dark:border-rose-950/30 dark:text-rose-300'
                    }`}>
                      <div className="flex items-start gap-1.5 align-middle">
                        {isCorrect ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0 text-rose-500" />}
                        <p>
                          <strong className="underline">{isCorrect ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action button bar */}
          {!quizSubmitted && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-right dark:border-slate-850">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length < QUIZ_QUESTIONS.length}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-40 cursor-pointer"
              >
                Submit Audit Quiz <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Audit Status sidebar */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Orchestrator Certification status</h4>
            
            {!quizSubmitted ? (
              <div className="mt-4 flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl filter grayscale">🏷️</span>
                <p className="mt-3 text-xs text-slate-500 font-mono">
                  Complete all 4 scenario audits on the left to activate evaluation sweeps. Pass threshold: 75% score.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Score Dial */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-150 text-center dark:bg-slate-950 dark:border-slate-850">
                  <span className="text-3xl font-bold font-mono text-slate-950 dark:text-white">{score}/4</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1 block">SCORE RATIO</span>
                  
                  {passed ? (
                    <div className="mt-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/20">
                      PASSED (ADK Accredited)
                    </div>
                  ) : (
                    <div className="mt-2 text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full dark:bg-rose-950/20">
                      FAIL (Requires 3/4 Score)
                    </div>
                  )}
                </div>

                <p className="text-xs leading-normal text-slate-500 dark:text-slate-400">
                  {passed 
                    ? "Congratulations! You evaluated multi-agent structures flawlessly. Your accredited ADK Architect Credential is ready on the board. Scroll down or write your full name to generate."
                    : "Unfortunately, you fell short of the certification safety score. Click \"Reset Quiz\" at the top to re-audit standard patterns."}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-indigo-50/50 p-3.5 border border-indigo-100/60 dark:bg-indigo-950/10 dark:border-indigo-900/40 text-[11px] text-indigo-850 dark:text-indigo-300">
            <div className="flex gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-indigo-500 animate-bounce" />
              <p className="leading-relaxed">
                Passing provides a secure ledger verification entry block. Carry your validated credentials directly into enterprise cloud integrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Canvas display */}
      {quizSubmitted && passed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 rounded-2xl border border-indigo-200/60 bg-white p-5 shadow-lg shadow-indigo-100/20 dark:border-indigo-900/40 dark:bg-slate-900 dark:shadow-none print:shadow-none"
        >
          {/* Certificate options row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-indigo-50 pb-4 dark:border-indigo-950 print:hidden">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">🎓 Multi-Agent Architect Certificate Credentials</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Edit your name inline below to align the certificate render, then print direct or save PDF.</p>
            </div>
            <div className="flex gap-2.5">
              <input 
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student full name"
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 dark:border-slate-800 dark:text-slate-100 dark:bg-slate-950"
              />
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 transition shadow cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <Printer className="h-3.5 w-3.5" /> Print Certificate
              </button>
            </div>
          </div>

          {/* Majestic high fidelity certificate board */}
          <div className="relative border-8 border-indigo-50/40 bg-white text-slate-950 p-8 sm:p-12 md:p-16 rounded-xl shadow-inner text-center overflow-hidden dark:bg-white dark:text-slate-950 print:border-indigo-300/40 print:p-12 print:shadow-none" id="certification-shield">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-indigo-950/20 pointer-events-none rounded-tl-lg m-4" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-indigo-950/20 pointer-events-none rounded-tr-lg m-4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-indigo-950/20 pointer-events-none rounded-bl-lg m-4" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-indigo-950/20 pointer-events-none rounded-br-lg m-4" />

            <div className="flex flex-col items-center max-w-3xl mx-auto">
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] sm:text-xs">GOOGLE AI STUDIO · STUDENT ACADEMY</span>
              
              <div className="mt-5 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-650 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Award className="h-8 w-8 text-yellow-350" />
                </div>
              </div>

              <h2 className="mt-6 font-serif text-2xl sm:text-3.5xl md:text-4xl text-slate-950 tracking-tight font-extrabold">
                Certificate of Competency
              </h2>

              <p className="mt-5 text-xs sm:text-sm text-slate-500 font-sans tracking-wide">
                This certifies that the aspiring developer orchestrator
              </p>

              <h3 className="mt-3.5 font-serif text-xl sm:text-2.5xl md:text-3xl font-black text-indigo-950 border-b border-indigo-100 pb-1 px-8 inline-block">
                {studentName || "Narendra Surase"}
              </h3>

              <p className="mt-5 text-xs sm:text-sm text-slate-600 font-sans max-w-lg leading-relaxed">
                has successfully audited and mastered the conceptual structures of multi-agent task coordination under the <strong>Google Agent Development Kit (ADK)</strong>. This credentials certifies validation metrics in sequential pipeline chains, manager/supervised routers, and peer review feedback choreography.
              </p>

              {/* Timestamp parameters block */}
              <div className="mt-10 grid grid-cols-2 gap-8 w-full border-t border-slate-100 pt-8 print:mt-8">
                <div className="text-left select-none">
                  <span className="text-[9.5px] text-slate-400 block font-bold tracking-wider uppercase">DATE OF AUDIT</span>
                  <span className="font-mono text-xs font-bold text-slate-850 mt-1 block">May 22, 2026</span>
                </div>
                <div className="text-right select-none">
                  <span className="text-[9.5px] text-slate-400 block font-bold tracking-wider uppercase">VALIDATION ID</span>
                  <span className="font-mono text-xs font-bold text-slate-850 mt-1 block tracking-wider">{customCertId}</span>
                </div>
              </div>

              {/* Autograph details */}
              <div className="mt-8 pt-4 w-full flex justify-center items-center select-none">
                <div className="border-t border-indigo-950/20 px-8 pt-2.5">
                  <span className="font-mono opacity-80 text-[10px] tracking-tight block italic text-indigo-750">Google AI Studio Build Team</span>
                  <span className="text-[8.5px] text-slate-400 block tracking-widest uppercase mt-0.5">CODELABS ADMISSIONS COMMITTEES</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
