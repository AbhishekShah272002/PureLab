import React from 'react';
import { AnalysisResult, TechnicalTerm } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Leaf, Info, AlertOctagon } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const TermItem: React.FC<{ term: TechnicalTerm }> = ({ term }) => {
  const colorClass = 
    term.category === 'Safe' ? 'bg-green-900/20 text-green-300 border-green-800' :
    term.category === 'Caution' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-800' :
    'bg-red-900/20 text-red-300 border-red-800';

  return (
    <div className={`p-3 rounded-lg border ${colorClass} mb-2`}>
      <div className="flex justify-between items-start">
        <span className="font-semibold">{term.term}</span>
        <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black bg-opacity-30">
          {term.category}
        </span>
      </div>
      <p className="text-sm mt-1 opacity-90">{term.simpleExplanation}</p>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-xl shadow-xl overflow-hidden animate-fade-in-up border border-slate-800">
      {/* Header */}
      <div className="bg-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold truncate pr-4">{result.productName || "Product Analysis"}</h2>
          {result.isVegan ? (
            <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full border border-green-400/50 backdrop-blur-sm">
              <Leaf size={16} className="text-green-100" />
              <span className="font-semibold text-sm text-green-50">Vegan</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-1 rounded-full border border-red-400/50 backdrop-blur-sm">
              <XCircle size={16} className="text-red-100" />
              <span className="font-semibold text-sm text-red-50">Not Vegan</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-indigo-100 text-sm opacity-90">{result.summary}</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Vegan Analysis */}
        {!result.isVegan && (
          <div className="bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-r">
            <div className="flex items-start">
              <AlertOctagon className="text-orange-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-orange-200">Why it isn't Vegan</h3>
                <p className="text-orange-300 text-sm mt-1">{result.veganReasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Allergens Section */}
        <div>
          <h3 className="text-lg font-bold text-slate-200 flex items-center mb-3">
            <AlertTriangle className="mr-2 text-red-500" size={20} />
            Detected Allergens
          </h3>
          {result.detectedAllergens.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.detectedAllergens.map((allergen, idx) => (
                <span key={idx} className="bg-red-900/30 text-red-300 px-3 py-1 rounded-full text-sm font-medium border border-red-800">
                  {allergen}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center text-green-400 bg-green-900/20 p-3 rounded-lg border border-green-900">
              <CheckCircle size={18} className="mr-2" />
              <span className="text-sm font-medium">No detected allergens.</span>
            </div>
          )}
        </div>

        {/* Technical Breakdown */}
        <div>
          <h3 className="text-lg font-bold text-slate-200 flex items-center mb-3">
            <Info className="mr-2 text-blue-500" size={20} />
            Ingredient Decoder
          </h3>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-800">
            {result.technicalTerms.length > 0 ? (
              result.technicalTerms.map((term, idx) => (
                <TermItem key={idx} term={term} />
              ))
            ) : (
              <p className="text-slate-500 italic text-sm text-center">No complex technical terms found needing explanation.</p>
            )}
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 border border-slate-700"
        >
          Analyze Another Product
        </button>
      </div>
    </div>
  );
};