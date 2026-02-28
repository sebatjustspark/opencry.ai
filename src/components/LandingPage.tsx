import { useState, useEffect } from 'react';
import { Asterisk, ArrowRight, Wallet, Shield, Zap, ChevronDown, Brain, Globe, Lock, X, MessageSquare, Image as ImageIcon, Mic } from 'lucide-react';
import { db } from '../services/db';

export default function LandingPage({ 
  onConnect, 
  theme,
  isAuthenticated,
  userEmail,
  onClose
}: { 
  onConnect: () => void;
  theme?: string;
  isAuthenticated?: boolean;
  userEmail?: string;
  onClose?: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsConnecting(true);
    setAuthError('');
    
    try {
      let result;
      if (authMode === 'signup') {
        result = await db.signUp(email, password);
      } else {
        result = await db.signIn(email, password);
      }
      
      if (result.success) {
        localStorage.setItem('opencry_user_email', email);
        onConnect();
      } else {
        setAuthError(result.error || 'Authentication failed');
        setIsConnecting(false);
      }
    } catch (err) {
      setAuthError('An error occurred. Please try again.');
      setIsConnecting(false);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${theme === 'dark' ? 'bg-[#121212] text-gray-100' : 'bg-[#f5f4f0] text-[#1A1A1A]'}`}>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? (theme === 'dark' ? 'bg-[#121212]/80 backdrop-blur-md border-b border-gray-800' : 'bg-[#f5f4f0]/80 backdrop-blur-md border-b border-gray-200') : 'bg-transparent'} flex items-center justify-between p-6 md:px-12 md:py-6`}>
        <div className="w-1/3"></div>
        <div className="flex items-center justify-center gap-3 w-1/3">
          <Asterisk className="w-8 h-8" />
          <span className="font-['DotGothic16'] text-xl tracking-wider">opencry</span>
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className={`text-sm hidden md:inline-block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{userEmail}</span>
              <button 
                onClick={onClose}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                Back to App
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowModal(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-32 px-6 text-center w-full">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-8xl font-serif tracking-tight leading-[1.1] mb-8">
            Intelligence for the <br className="hidden md:block" /> decentralized web.
          </h1>
          <p className={`text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Meet opencry, a next-generation AI assistant designed to help you reason, create, and explore with unprecedented clarity. Sign up to begin.
          </p>
          
          {isAuthenticated ? (
            <button 
              onClick={onClose}
              className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/10'}`}
            >
              Go to App <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => { setAuthMode('signup'); setShowModal(true); }}
              className={`group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/10'}`}
            >
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        <div id="features" className="w-full max-w-6xl mx-auto py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">opencry 1.0</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Lightning fast responses for everyday queries and tasks. Built for speed and efficiency without compromising quality.</p>
          </div>
          
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">opencry 1.2 max</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Advanced reasoning for complex analysis, coding, and deep problem solving. Our most capable model yet.</p>
          </div>
          
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Deep Search</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Access real-time information from across the web. opencry grounds its answers in the latest available data.</p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Image Generation</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Create stunning visuals from text descriptions. Bring your ideas to life with our advanced image generation capabilities.</p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Voice Assistant</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Interact naturally using your voice. Have real-time, flowing conversations with opencry just like you would with a human.</p>
          </div>

          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'border-gray-800 bg-[#1e1e1e] hover:border-gray-700 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Privacy First</h3>
            <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your conversations are private and secure. We believe in empowering users with AI while respecting their data sovereignty.</p>
          </div>
        </div>
      </main>

      <footer className={`py-16 flex flex-col items-center justify-center border-t ${theme === 'dark' ? 'border-gray-800 bg-[#0a0a0a]' : 'border-gray-200 bg-white'}`}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black dark:bg-white transform -skew-x-12 flex items-center justify-center">
              <Asterisk className="w-8 h-8 text-white dark:text-black" />
            </div>
            <span className="font-serif text-4xl font-bold tracking-tight text-black dark:text-white">opencry</span>
          </div>
        </div>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} opencry. All rights reserved.
        </p>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-[#1e1e1e] text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-shadow' : 'bg-white text-black'}`}>
            <button 
              onClick={() => setShowModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'text-gray-500 hover:text-black hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
            <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <Asterisk className="w-6 h-6" />
                  <span className="font-serif text-xl font-bold tracking-tight">opencryID</span>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <button 
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 pb-2 text-lg font-semibold transition-colors border-b-2 ${authMode === 'signup' ? (theme === 'dark' ? 'border-white text-white' : 'border-black text-black') : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 pb-2 text-lg font-semibold transition-colors border-b-2 ${authMode === 'signin' ? (theme === 'dark' ? 'border-white text-white' : 'border-black text-black') : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                >
                  Sign In
                </button>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {authMode === 'signup' ? 'Create an opencryID to get started' : 'Sign in with your opencryID'}
              </p>
            </div>
            
            <div className="p-6">
              {isConnecting ? (
                <div className="py-12 flex flex-col items-center justify-center animate-in fade-in">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="font-medium">Authenticating...</p>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Please wait a moment</p>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  {authError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                      {authError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-black'}`}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white focus:border-white focus:shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-black'}`}
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    type="submit"
                    className={`w-full py-3 rounded-xl font-medium mt-6 transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    {authMode === 'signup' ? 'Create opencryID' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
