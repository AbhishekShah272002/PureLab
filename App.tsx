import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { ResultCard } from './components/ResultCard';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, AnalysisMode } from './types';
import { ScanSearch } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (content: string, mode: AnalysisMode, mimeType?: string, customAllergies?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeContent(content, mode === AnalysisMode.IMAGE, mimeType, customAllergies);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue analyzing the content. Please ensure the image is clear or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={handleReset}>
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <ScanSearch className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">PureLabel</h1>
                <p className="text-xs text-slate-400 -mt-1 font-medium">Ingredient Decoder</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!result ? (
          <>
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
                Know What You <span className="text-indigo-500">Eat</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Instantly identify <span className="font-semibold text-slate-200">allergens</span>, check <span className="font-semibold text-slate-200">vegan</span> suitability, and decode confusing <span className="font-semibold text-slate-200">technical terms</span> on any food label.
              </p>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto mb-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-300 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            
            {/* Feature Highlights (Only shown on landing) */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-slate-900 rounded-xl shadow-sm border border-slate-800">
                <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="font-bold text-white mb-2">Vegan Check</h3>
                <p className="text-sm text-slate-400">Instantly know if a product is plant-based or contains hidden animal derivatives.</p>
              </div>
              <div className="text-center p-6 bg-slate-900 rounded-xl shadow-sm border border-slate-800">
                <div className="w-12 h-12 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="font-bold text-white mb-2">Allergen Alert</h3>
                <p className="text-sm text-slate-400">Detects common allergens and your custom sensitivities automatically.</p>
              </div>
              <div className="text-center p-6 bg-slate-900 rounded-xl shadow-sm border border-slate-800">
                <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="font-bold text-white mb-2">De-Jargonizer</h3>
                <p className="text-sm text-slate-400">Understand what E-numbers and chemical names actually mean for your health.</p>
              </div>
            </div>
          </>
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="mt-20 border-t border-slate-800 py-8">
         <p className="text-center text-slate-500 text-sm">
           Powered by Gemini AI • Not medical advice. Always check labels manually.
         </p>
      </footer>
    </div>
  );
};

export default App;