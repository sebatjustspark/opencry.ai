import { useState } from 'react';
import { Plus, Settings as SettingsIcon, MessageSquare, PanelLeft, Moon, Sun, X, ChevronRight, Home, LogOut, Trash2, Shield } from 'lucide-react';
import { ChatSession, Settings } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar({ 
  onNewChat, 
  settings,
  setSettings,
  chats, 
  currentChatId, 
  onSelectChat,
  onGoHome,
  isPrivate,
  setIsPrivate
}: { 
  onNewChat: () => void; 
  settings: Settings;
  setSettings: (s: Settings) => void;
  chats: ChatSession[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onGoHome: () => void;
  isPrivate: boolean;
  setIsPrivate: (val: boolean) => void;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogoClick = () => {
    // Logo click easter egg removed
  };

  const handleLogout = () => {
    localStorage.removeItem('opencry_auth');
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    if (confirm('Server: Y Do you want to permanently delete your account and all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <div className={`h-screen flex flex-col items-center py-6 bg-[#f5f4f0] dark:bg-[#121212] shrink-0 hidden md:flex transition-all duration-300 border-r border-transparent relative z-50 ${isCollapsed ? 'w-0 overflow-hidden opacity-0 p-0' : 'w-16 opacity-100'}`}>
        <div 
          onClick={handleLogoClick}
          className="mb-8 font-['DotGothic16'] text-sm tracking-widest text-[#8b8575] dark:text-gray-400 rotate-[-90deg] whitespace-nowrap mt-4 cursor-pointer select-none"
        >
          opencry
        </div>
        
        <div className="flex flex-col gap-4 w-full items-center">
          <button onClick={() => setIsCollapsed(true)} className="p-2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300 hover:scale-110 group relative">
            <PanelLeft className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Toggle Sidebar</span>
          </button>
          
          <button onClick={onNewChat} className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110 shadow-sm group relative">
            <Plus className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">New Chat (⌘N)</span>
          </button>

          <button onClick={() => setShowHistory(!showHistory)} className={`p-2 transition-all duration-300 hover:scale-110 group relative ${showHistory ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}>
            <MessageSquare className="w-5 h-5" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">History</span>
          </button>

          <div className="mt-auto absolute bottom-6 flex flex-col items-center gap-6">
            <button onClick={onGoHome} className="p-2 transition-all duration-300 hover:scale-110 group relative text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <Home className="w-5 h-5" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Home</span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 transition-all duration-300 hover:scale-110 ${showSettings ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
              >
                <SettingsIcon className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-full ml-4 w-72 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 z-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Settings</h3>
                      <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                      <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Account</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {localStorage.getItem('opencry_user_email') || 'User'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Theme</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSettings({ ...settings, theme: 'light' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors ${settings.theme === 'light' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                          >
                            <Sun className="w-4 h-4" /> Light
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, theme: 'dark' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors ${settings.theme === 'dark' ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                          >
                            <Moon className="w-4 h-4" /> Dark
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Tone</label>
                        <select
                          value={settings.presetTone}
                          onChange={(e) => setSettings({ ...settings, presetTone: e.target.value as any })}
                          className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none cursor-pointer"
                        >
                          <option value="standard">Standard</option>
                          <option value="concise">Concise</option>
                          <option value="creative">Creative</option>
                          <option value="professional">Professional</option>
                        </select>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={() => setIsPrivate(!isPrivate)}
                          className="w-full flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Private Chat</span>
                          <div className={`w-8 h-4 rounded-full transition-colors ${isPrivate ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'} relative`}>
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white dark:bg-black transition-all ${isPrivate ? 'left-4.5' : 'left-0.5'}`} />
                          </div>
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Private chats are not saved to history.</p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 py-2 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-sm transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="w-full flex items-center gap-2 py-2 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="fixed top-6 left-6 z-50 p-2 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-16 w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 shadow-2xl z-40 flex flex-col"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 dark:text-white">Chat History</h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chats.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">No history yet</p>
              ) : (
                chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 768) setShowHistory(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${currentChatId === chat.id ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                  >
                    {chat.title}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
