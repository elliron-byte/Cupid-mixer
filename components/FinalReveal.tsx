import React, { useEffect, useState } from 'react';
import { generateLovePrediction } from '../services/geminiService.ts';
import { HeartIcon } from './HeartIcon.tsx';

interface FinalRevealProps {
  selectedName: string;
  coupleData: { name1: string; name2: string };
  onReset: () => void;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({ selectedName, coupleData, onReset }) => {
  const [prediction, setPrediction] = useState<string>('');
  const [loadingPrediction, setLoadingPrediction] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const pred = await generateLovePrediction(selectedName, coupleData.name1, coupleData.name2);
      setPrediction(pred);
      setLoadingPrediction(false);
    };
    fetchPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div className="glass-panel rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-love-200 border-4 border-white relative overflow-hidden">
        
        {/* Decorative background hearts */}
        <div className="absolute -top-10 -left-10 text-love-100 opacity-50">
            <HeartIcon className="w-40 h-40" fill />
        </div>
        <div className="absolute -bottom-10 -right-10 text-love-100 opacity-50">
            <HeartIcon className="w-40 h-40" fill />
        </div>

        <div className="relative z-10">
            <p className="text-love-500 font-bold uppercase tracking-widest mb-4 text-sm">Official Ship Name</p>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-love-500 to-purple-600 mb-8 py-2 animate-float">
            {selectedName}
            </h1>

            <div className="bg-white/50 rounded-xl p-6 mb-8 min-h-[100px] flex items-center justify-center">
                {loadingPrediction ? (
                    <div className="flex gap-2 items-center text-love-400">
                        <span className="w-2 h-2 bg-love-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-love-400 rounded-full animate-bounce delay-200"></span>
                        <span className="text-sm ml-2">Reading the stars...</span>
                    </div>
                ) : (
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                        "{prediction}"
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={onReset}
                    className="px-8 py-3 rounded-full bg-love-50 text-love-600 font-bold border-2 border-love-200 hover:bg-love-100 transition-colors"
                >
                    Mix New Names
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};