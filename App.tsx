import React, { useState } from 'react';
import { InputForm } from './components/InputForm.tsx';
import { SelectionGrid } from './components/SelectionGrid.tsx';
import { FinalReveal } from './components/FinalReveal.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { generateCoupleNames } from './services/geminiService.ts';
import { AppState, CoupleData } from './types.ts';
import { HeartIcon } from './components/HeartIcon.tsx';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [coupleData, setCoupleData] = useState<CoupleData>({ name1: '', name2: '' });
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');

  const handleGenerate = async (name1: string, name2: string) => {
    setCoupleData({ name1, name2 });
    setAppState('loading');
    
    try {
      const names = await generateCoupleNames(name1, name2);
      setGeneratedNames(names);
      setAppState('selection');
    } catch (error) {
      console.error(error);
      alert("Cupid is busy right now (API Error). Please try again!");
      setAppState('input');
    }
  };

  const handleSelect = (name: string) => {
    setSelectedName(name);
    setAppState('result');
  };

  const handleReset = () => {
    setAppState('input');
    setCoupleData({ name1: '', name2: '' });
    setGeneratedNames([]);
    setSelectedName('');
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-love-50 via-white to-love-100 text-gray-800 overflow-x-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-love-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative z-10 w-full py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
           <HeartIcon className="w-8 h-8 text-love-500" fill />
           <h1 className="text-3xl md:text-4xl font-cursive text-love-600 pt-1">Cupid's Mixer</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center min-h-[calc(100vh-120px)]">
        
        {appState === 'input' && (
          <InputForm onGenerate={handleGenerate} />
        )}

        {appState === 'loading' && (
          <div className="flex-1 flex flex-col justify-center">
             <LoadingScreen />
          </div>
        )}

        {appState === 'selection' && (
          <SelectionGrid 
            names={generatedNames} 
            onSelect={handleSelect}
            onReset={handleReset}
          />
        )}

        {appState === 'result' && (
          <div className="flex-1 flex flex-col justify-center w-full">
            <FinalReveal 
                selectedName={selectedName} 
                coupleData={coupleData} 
                onReset={handleReset} 
            />
          </div>
        )}

      </main>

      <footer className="relative z-10 text-center py-6 text-love-900 opacity-60 text-sm font-medium">
        <p>Made with love & Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;