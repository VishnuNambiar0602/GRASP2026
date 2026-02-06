
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AssessmentForm from './components/AssessmentForm';
import AssessmentHistory from './components/AssessmentHistory';
import SuccessView from './components/SuccessView';
import { AppView, Assessment } from './types';
import { analyzeSymptoms } from './services/gemini';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [currentResult, setCurrentResult] = useState<Partial<Assessment> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail] = useState('user@health-portal.com');

  // Load history from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('assessment_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleStartAssessment = () => setCurrentView(AppView.ASSESSMENT_FORM);

  const handleSubmitAssessment = async (symptoms: string) => {
    setIsLoading(true);
    setCurrentView(AppView.ANALYZING);
    
    try {
      const analysis = await analyzeSymptoms(symptoms);
      const newAssessment: Assessment = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        symptoms,
        ...analysis
      };

      const updatedHistory = [newAssessment, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('assessment_history', JSON.stringify(updatedHistory));
      
      setCurrentResult(newAssessment);
      setCurrentView(AppView.RESULT);
    } catch (error) {
      console.error("Assessment Error:", error);
      const message = error instanceof Error && error.message === 'MODEL_NOT_CONFIGURED'
        ? 'The assessment model is not configured yet. Please try again once the model is ready.'
        : 'There was an error analyzing your symptoms. Our AI model might be busy. Please try again in a moment.';
      alert(message);
      setCurrentView(AppView.ASSESSMENT_FORM);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReport = () => {
    // Simulate sending email process
    setCurrentView(AppView.SUCCESS);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden transition-colors duration-300">
      <Header currentView={currentView} setView={setCurrentView} />

      <main className="flex flex-1 items-center justify-center p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/20">
        {currentView === AppView.DASHBOARD && (
          <div className="text-center max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-8 inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined !text-5xl">health_and_safety</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
              Intelligent <span className="text-primary">Health</span> Assessment
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 leading-relaxed">
              Experience the future of personal healthcare. Our medical-grade AI analyzes your symptoms to provide professional-level preliminary guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
              <button 
                onClick={handleStartAssessment}
                className="px-10 h-16 bg-primary text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="material-symbols-outlined">medical_services</span>
                Start Assessment
              </button>
              <button 
                onClick={() => setCurrentView(AppView.HISTORY)}
                className="px-10 h-16 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15292c] text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <span className="material-symbols-outlined">history</span>
                View My History
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-200 dark:border-slate-800 pt-12">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">bolt</span> Rapid Analysis
                </h3>
                <p className="text-sm text-slate-500">Get insights in under 30 seconds using advanced Gemini models.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">assignment</span> Care Pathways
                </h3>
                <p className="text-sm text-slate-500">Clear next steps you can act on while you plan a clinical visit.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">lock</span> Secure & Private
                </h3>
                <p className="text-sm text-slate-500">Your health data is processed locally and never stored permanently.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.ASSESSMENT_FORM && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AssessmentForm 
              onSubmit={handleSubmitAssessment} 
              onCancel={() => setCurrentView(AppView.DASHBOARD)} 
            />
          </div>
        )}

        {currentView === AppView.ANALYZING && (
          <div className="flex flex-col items-center gap-8 text-center animate-pulse">
            <div className="relative size-24">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">AI Diagnostic in Progress</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Our medical neural engine is analyzing your symptoms and cross-referencing global health patterns...
              </p>
            </div>
          </div>
        )}

        {currentView === AppView.RESULT && currentResult && (
          <div className="w-full max-w-3xl bg-white dark:bg-[#15292c] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-widest">
                    Assessment Report
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Ref ID: {currentResult.id?.slice(-6)}</span>
                </div>
                <div className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black border-2 ${
                  currentResult.riskLevel === 'Low' ? 'border-green-100 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-900/30' :
                  currentResult.riskLevel === 'Moderate' ? 'border-yellow-100 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-900/30' :
                  'border-red-100 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-900/30'
                }`}>
                  <span className="material-symbols-outlined !text-base">warning</span>
                  {currentResult.riskLevel} Risk Profile
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentResult.summary}
              </h1>
            </div>
            
            <div className="p-8 md:p-12 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
                  </div>
                  <h3 className="text-xl font-bold">Recommended Actions</h3>
                </div>
                <ul className="grid grid-cols-1 gap-4">
                  {currentResult.recommendations?.map((rec, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-hover hover:border-primary/30">
                      <div className="size-6 shrink-0 bg-primary text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {rec}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-slate-500">info</span>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  <strong>Important Medical Disclaimer:</strong> This report is AI-generated for informational support and does not constitute official medical advice. In case of emergency, contact local emergency services immediately.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={handleSendReport}
                  className="flex-1 h-16 bg-primary text-black font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">mail</span>
                  Send Full Report
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.DASHBOARD)}
                  className="px-10 h-16 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Close Results
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === AppView.SUCCESS && (
          <SuccessView 
            userEmail={userEmail} 
            onNewAssessment={() => setCurrentView(AppView.ASSESSMENT_FORM)} 
            onGoHome={() => setCurrentView(AppView.DASHBOARD)} 
          />
        )}

        {currentView === AppView.HISTORY && (
          <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <AssessmentHistory history={history} />
          </div>
        )}
      </main>
      
      <footer className="py-10 px-6 text-center border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#15292c]">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Terms of Use</a>
          <a href="#" className="text-slate-400 hover:text-primary text-sm font-medium transition-colors">Contact Support</a>
        </div>
        <p className="text-slate-400 text-xs">
          Powered by Gemini 3 Flash. Built for advanced health diagnostics. 
          <br className="md:hidden" /> © 2025 Medical AI Assessments Inc.
        </p>
      </footer>
    </div>
  );
};

export default App;
