import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
interface ShipNameResult {
  names: string[];
}

interface CoupleData {
  name1: string;
  name2: string;
}

type AppState = 'input' | 'loading' | 'selection' | 'result';

// --- Service: Gemini AI ---
const getClient = () => {
    // Safety check for browser environment
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    if (!apiKey) {
        console.warn("API_KEY is missing. The app may not function correctly.");
    }
    return new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY' });
};

const generateCoupleNames = async (name1: string, name2: string): Promise<string[]> => {
    const ai = getClient();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a list of 12 creative, catchy, and fun "ship names" (couple names) by merging '${name1}' and '${name2}'. 
            Mix the syllables, sounds, and letters in different ways. 
            Some should be cute, some funny, and some clever.
            Ensure the names are phonetic and pronounceable.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                },
                temperature: 0.7, 
            },
        });

        if (response.text) {
            const data = JSON.parse(response.text);
            if (Array.isArray(data)) {
                return data;
            }
        }
        return [];
    } catch (error) {
        console.error("Error generating couple names:", error);
        throw error;
    }
};

const generateLovePrediction = async (shipName: string, name1: string, name2: string): Promise<string> => {
    const ai = getClient();
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, whimsical, and funny "astrological" prediction (max 2 sentences) for the couple named "${shipName}" (composed of ${name1} and ${name2}). Make it sound like a playful horoscope.`,
        });
        return response.text || "The stars are aligning for this perfect match!";
    } catch (error) {
        console.error("Error generating prediction", error);
        return "A match made in heaven!";
    }
}

// --- Components ---

interface HeartIconProps {
  className?: string;
  fill?: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({ className = "w-6 h-6", fill = false }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={fill ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

interface InputFormProps {
  onGenerate: (name1: string, name2: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
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

const LoadingScreen: React.FC = () => {
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

interface SelectionGridProps {
  names: string[];
  onSelect: (name: string) => void;
  onReset: () => void;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({ names, onSelect, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
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

interface FinalRevealProps {
  selectedName: string;
  coupleData: { name1: string; name2: string };
  onReset: () => void;
}

const FinalReveal: React.FC<FinalRevealProps> = ({ selectedName, coupleData, onReset }) => {
  const [prediction, setPrediction] = useState<string>('');
  const [loadingPrediction, setLoadingPrediction] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const pred = await generateLovePrediction(selectedName, coupleData.name1, coupleData.name2);
      setPrediction(pred);
      setLoadingPrediction(false);
    };
    fetchPrediction();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
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

// --- Main App Component ---

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

// --- Root Render ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
