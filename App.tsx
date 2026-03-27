import { useState, useEffect } from 'react';
import Registration from './components/Registration';
import Introduction from './components/Introduction';
import Module1 from './components/Module1';
import Module2 from './components/Module2';
import Module3 from './components/Module3';
import SQLConsole from './components/SQLConsole';
import Exercises from './components/Exercises';
import Results from './components/Results';

interface Student {
  nom: string;
  prenom: string;
  classe: string;
}

const STEPS = [
  { id: 0, label: 'Inscription', icon: '📝', shortLabel: 'Inscription' },
  { id: 1, label: 'Introduction', icon: '📖', shortLabel: 'Intro' },
  { id: 2, label: 'Comprendre une table', icon: '📊', shortLabel: 'Tables' },
  { id: 3, label: 'Clé primaire', icon: '🔑', shortLabel: 'Clé PK' },
  { id: 4, label: 'Clé étrangère', icon: '🔗', shortLabel: 'Clé FK' },
  { id: 5, label: 'Console SQL', icon: '💻', shortLabel: 'Console' },
  { id: 6, label: 'Exercices notés', icon: '🏆', shortLabel: 'Exercices' },
  { id: 7, label: 'Résultats', icon: '🎓', shortLabel: 'Note' },
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [student, setStudent] = useState<Student | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goToStep = (step: number) => {
    if (step === 0 || (student && step <= Math.max(...Array.from(completedSteps), currentStep) + 1)) {
      setCurrentStep(step);
      setSidebarOpen(false);
    }
  };

  const markCompleteAndNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setCurrentStep(prev => prev + 1);
    setSidebarOpen(false);
  };

  const handleRegister = (info: Student) => {
    setStudent(info);
    setCompletedSteps(new Set([0]));
    setCurrentStep(1);
  };

  const handleFinishExercises = (newScores: number[]) => {
    setScores(newScores);
    setCompletedSteps(prev => new Set([...prev, 6]));
    setCurrentStep(7);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setStudent(null);
    setCompletedSteps(new Set());
    setScores([]);
  };

  // Registration page - full screen, no sidebar
  if (currentStep === 0) {
    return <Registration onRegister={handleRegister} />;
  }

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <Introduction onNext={markCompleteAndNext} />;
      case 2:
        return <Module1 onNext={markCompleteAndNext} onPrev={() => setCurrentStep(1)} />;
      case 3:
        return <Module2 onNext={markCompleteAndNext} onPrev={() => setCurrentStep(2)} />;
      case 4:
        return <Module3 onNext={markCompleteAndNext} onPrev={() => setCurrentStep(3)} />;
      case 5:
        return <SQLConsole onNext={markCompleteAndNext} onPrev={() => setCurrentStep(4)} />;
      case 6:
        return <Exercises onFinish={handleFinishExercises} onPrev={() => setCurrentStep(5)} />;
      case 7:
        return student ? (
          <Results student={student} scores={scores} onRestart={handleRestart} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-1"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2 text-white font-semibold">
          <span>{STEPS[currentStep]?.icon}</span>
          <span className="text-sm">{STEPS[currentStep]?.shortLabel}</span>
        </div>
        <div className="text-slate-400 text-sm">
          {currentStep}/7
        </div>
      </div>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 border-r border-slate-800 
        flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">SQL Academy</h1>
              <p className="text-slate-500 text-xs">Apprends le SQL</p>
            </div>
          </div>
        </div>

        {/* Student info */}
        {student && (
          <div className="px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {student.prenom[0]}{student.nom[0]}
              </div>
              <div>
                <div className="text-white text-sm font-medium">{student.prenom} {student.nom}</div>
                <div className="text-slate-500 text-xs">{student.classe}</div>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="px-6 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Progression</span>
            <span className="text-indigo-400 text-xs font-bold">{completedSteps.size}/{STEPS.length - 1}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.size / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {STEPS.slice(1).map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.has(step.id);
            const isAccessible = step.id <= Math.max(...Array.from(completedSteps), currentStep) + 1 || completedSteps.has(step.id);

            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                disabled={!isAccessible}
                className={`w-full px-6 py-3 flex items-center gap-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 border-r-2 border-indigo-500 text-white'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-slate-800/50'
                    : isAccessible
                    ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : step.icon}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="text-center text-slate-600 text-xs">
            SQL Academy v1.0
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
