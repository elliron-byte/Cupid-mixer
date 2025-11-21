import React from 'react';
import { HeartIcon } from './HeartIcon';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
         <div className="absolute inset-0 animate-ping opacity-30 text-love-400">
            <HeartIcon className="w-24 h-24" fill />
         </div>
         <div className="relative animate-pulse-slow text-love-500">
            <HeartIcon className="w-24 h-24" fill />
         </div>
      </div>
      <h3 className="text-2xl font-cursive text-love-600 mb-2">Mixing Love Potions...</h3>
      <p className="text-love-800 opacity-70">Analyzing phonetic compatibility</p>
    </div>
  );
};