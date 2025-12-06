import React, { useState, useRef } from 'react';
import { AnalysisMode } from '../types';
import { Camera, Type, Upload, Loader2, Search, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (content: string, mode: AnalysisMode, mimeType?: string, customAllergies?: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.TEXT);
  const [textInput, setTextInput] = useState('');
  const [customAllergies, setCustomAllergies] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 data (remove "data:image/xyz;base64," prefix)
      const base64Data = result.split(',')[1];
      onAnalyze(base64Data, AnalysisMode.IMAGE, file.type, customAllergies);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onAnalyze(textInput, AnalysisMode.TEXT, undefined, customAllergies);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex bg-slate-900 rounded-lg p-1 shadow-md border border-slate-800">
        <button
          onClick={() => setMode(AnalysisMode.TEXT)}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === AnalysisMode.TEXT 
              ? 'bg-indigo-600 text-white shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Type size={18} className="mr-2" />
          Paste Ingredients
        </button>
        <button
          onClick={() => setMode(AnalysisMode.IMAGE)}
          className={`flex-1 flex items-center justify-center py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            mode === AnalysisMode.IMAGE 
              ? 'bg-indigo-600 text-white shadow' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Camera size={18} className="mr-2" />
          Scan Label
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 rounded-xl shadow-xl p-6 border border-slate-800 min-h-[300px] flex flex-col justify-center">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-slate-100">Analyzing...</h3>
            <p className="text-slate-400 mt-2 text-center max-w-xs">
              Our AI expert is checking for allergens, vegan status, and decoding technical terms.
            </p>
          </div>
        ) : mode === AnalysisMode.TEXT ? (
          <form onSubmit={handleTextSubmit} className="flex flex-col h-full">
            <textarea
              className="w-full flex-grow p-4 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-200 bg-slate-800 mb-4 h-48 placeholder-slate-500"
              placeholder="Paste the ingredient list here (e.g., 'Water, Sugar, E330, Sodium Benzoate...')"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                <AlertCircle size={14} className="mr-1.5 text-indigo-400" />
                Custom Allergies (Optional)
              </label>
              <input 
                type="text" 
                value={customAllergies}
                onChange={(e) => setCustomAllergies(e.target.value)}
                placeholder="e.g. Strawberries, Mushrooms, Caffeine"
                className="w-full p-3 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!textInput.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-900/20"
            >
              <Search size={20} className="mr-2" />
              Analyze Ingredients
            </button>
          </form>
        ) : (
          <div className="flex flex-col h-full">
             <div 
              className={`flex-grow flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl transition-colors mb-4 ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 bg-slate-800 text-indigo-400 rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} />
                </div>
                <p className="text-lg font-medium text-slate-200 mb-1">Upload Product Label</p>
                <p className="text-sm text-slate-500 mb-4">Drag & drop or click to upload</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200 font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                  Select Image
                </button>
              </div>
            </div>

            <div className="mb-0">
              <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                <AlertCircle size={14} className="mr-1.5 text-indigo-400" />
                Custom Allergies (Optional)
              </label>
              <input 
                type="text" 
                value={customAllergies}
                onChange={(e) => setCustomAllergies(e.target.value)}
                placeholder="e.g. Strawberries, Mushrooms, Caffeine"
                className="w-full p-3 border border-slate-700 rounded-lg bg-slate-800 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};