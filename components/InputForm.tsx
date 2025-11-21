import React, { useState } from 'react';
import { HeartIcon } from './HeartIcon.tsx';

interface InputFormProps {
  onGenerate: (name1: string, name2: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      setError("Please enter both names to let Cupid work his magic!");
      return;
    }
    setError('');
    onGenerate(name1, name2);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-float">
      <div className="glass-panel rounded-3xl p-8 shadow-xl shadow-love-200">
        <h2 className="text-3xl font-cursive text-love-600 text-center mb-2">Who are the lovebirds?</h2>
        <p className="text-love-900 text-center mb-8 opacity-80">Enter two names to blend them into one.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name1" className="block text-sm font-bold text-love-800 uppercase tracking-wide">First Name</label>
            <input
              id="name1"
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-love-200 focus:border-love-500 focus:ring focus:ring-love-200 focus:ring-opacity-50 outline-none transition-all text-lg text-gray-800 placeholder-love-300 bg-white/80"
              placeholder="e.g. Romeo"
            />
          </div>

          <div className="flex justify-center -my-2 relative z-10">
             <div className="bg-love-100 rounded-full p-2 border-4 border-white">
                <HeartIcon className="w-6 h-6 text-love-500" fill />
             </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="name2" className="block text-sm font-bold text-love-800 uppercase tracking-wide">Second Name</label>
            <input
              id="name2"
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-love-200 focus:border-love-500 focus:ring focus:ring-love-200 focus:ring-opacity-50 outline-none transition-all text-lg text-gray-800 placeholder-love-300 bg-white/80"
              placeholder="e.g. Juliet"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-love-500 to-love-600 hover:from-love-600 hover:to-love-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            <HeartIcon className="w-5 h-5" fill />
            <span>Mix Names</span>
          </button>
        </form>
      </div>
    </div>
  );
};