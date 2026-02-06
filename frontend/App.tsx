
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SymptomSelector from './components/SymptomSelector';
import AssessmentHistory from './components/AssessmentHistory';
import SuccessView from './components/SuccessView';
import ResultsWithSpecialists from './components/ResultsWithSpecialists';
import { AppView, Assessment } from './types';
import { analyzeSymptoms } from './services/prediction';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [currentResult, setCurrentResult] = useState<Partial<Assessment> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleStartAssessment = () => {
    setCurrentView(AppView.ASSESSMENT_FORM);
  };

  const handleSubmitAssessment = async (symptoms: string[], days: number, region: string) => {
    setIsLoading(true);
    setCurrentView(AppView.ANALYZING);
    
    try {
      const symptomText = symptoms.join(', ');
      const analysis = await analyzeSymptoms(symptomText, days, region);
      const riskLevel = analysis.riskLevel as 'Low' | 'Moderate' | 'High';
      const newAssessment: Assessment = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        symptoms: symptomText,
        summary: analysis.summary,
        riskLevel: riskLevel,
        recommendations: analysis.recommendations,
        apiResponse: analysis.apiResponse  // Store full API response
      };

      const updatedHistory = [newAssessment, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('assessment_history', JSON.stringify(updatedHistory));
      
      setCurrentResult(newAssessment);
      setCurrentView(AppView.RESULT);
    } catch (error) {
      console.error("Assessment Error:", error);
      let message = 'There was an error analyzing your symptoms. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          message = 'Cannot connect to the analysis server. Make sure the API is running on port 8000.';
        } else if (error.message.includes('No symptoms recognized')) {
          message = 'None of the symptoms you entered were recognized. Please try different symptoms.';
        } else {
          message = `Error: ${error.message}`;
        }
      }
      
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
                <p className="text-sm text-slate-500">Get insights in under 30 seconds using advanced AI models.</p>
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
          <div className="animate-in fade-in zoom-in duration-300 w-full">
            <SymptomSelector 
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

        {currentView === AppView.RESULT && currentResult && currentResult.apiResponse && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ResultsWithSpecialists
              disease={currentResult.apiResponse.disease}
              confidence={currentResult.apiResponse.confidence}
              topPredictions={currentResult.apiResponse.top_predictions}
              specialistRecommendations={currentResult.apiResponse.specialist_recommendations}
              explanation={currentResult.apiResponse.explanation}
              importantFeatures={currentResult.apiResponse.important_features}
              matchedSymptoms={currentResult.apiResponse.matched_symptoms}
              days={currentResult.apiResponse.days}
              region={currentResult.apiResponse.region}
              date={currentResult.date}
              onClose={() => setCurrentView(AppView.DASHBOARD)}
            />
          </div>
        )}

        {currentView === AppView.SUCCESS && (
          <SuccessView 
            userEmail="user@health-portal.com" 
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
          Powered by medical AI. Built for advanced health diagnostics. 
          <br className="md:hidden" /> © 2025 Medical AI Assessments Inc.
        </p>
      </footer>
    </div>
  );
};

export default App;
