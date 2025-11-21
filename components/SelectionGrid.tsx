import React from 'react';
import { HeartIcon } from './HeartIcon';

interface SelectionGridProps {
  names: string[];
  onSelect: (name: string) => void;
  onReset: () => void;
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({ names, onSelect, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-cursive text-love-600 mb-2">The Results Are In!</h2>
        <p className="text-love-900 opacity-80 text-lg">Choose the one that sounds perfect to you.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {names.map((name, index) => (
          <button
            key={index}
            onClick={() => onSelect(name)}
            className="group relative bg-white/60 hover:bg-white border-2 border-love-200 hover:border-love-400 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-center min-h-[120px]"
          >
             <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <HeartIcon className="w-5 h-5 text-love-500" fill />
             </div>
            <span className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-love-600 transition-colors">
              {name}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={onReset}
          className="text-love-600 font-semibold hover:text-love-800 underline decoration-2 decoration-transparent hover:decoration-love-600 transition-all"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};