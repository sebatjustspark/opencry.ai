import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import VoiceModal from './components/VoiceModal';
import LandingPage from './components/LandingPage';
import { ChatSession, Message, Settings, Attachment, ModelType } from './types';
import { generateTextStream, generateImage } from './services/gemini';
import { Asterisk } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    presetTone: 'standard',
    alwaysReason: false,
    theme: 'light',
  });
  const [selectedModel, setSelectedModel] = useState<ModelType>('opencry 1.0');
  const [showSettings, setShowSettings] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('opencry_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    const saved = localStorage.getItem('opencry_chats');
    if (saved) {
      setChats(JSON.parse(saved));
    }
    const savedSettings = localStorage.getItem('opencry_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setIsReasoning(parsed.alwaysReason);
    }
  }, []);

  const handleConnect = () => {
    setIsAuthenticated(true);
    localStorage.setItem('opencry_auth', 'true');
  };

  useEffect(() => {
    const publicChats = chats.filter(c => !c.isPrivate);
    localStorage.setItem('opencry_chats', JSON.stringify(publicChats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('opencry_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const currentChat = chats.find(c => c.id === currentChatId);

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const newChat: ChatSession = {
        id: chatId,
        title: text.slice(0, 30) + '...',
        messages: [],
        updatedAt: Date.now(),
        isPrivate,
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      attachments,
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, messages: [...c.messages, userMessage], updatedAt: Date.now() };
      }
      return c;
    }));

    const modelMessageId = (Date.now() + 1).toString();
    const initialModelMessage: Message = {
      id: modelMessageId,
      role: 'model',
      text: '',
      isStreaming: true,
      isReasoning: isReasoning,
      modelUsed: isReasoning ? 'gemini-3.1-pro-preview' : isDeepSearch ? 'gemini-3-flash-preview' : selectedModel === 'opencry 1.2 max' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash-lite',
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        return { ...c, messages: [...c.messages, initialModelMessage] };
      }
      return c;
    }));

    try {
      const history = currentChat?.messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })) || [];

      const stream = generateTextStream(text, history, {
        model: selectedModel,
        isReasoning,
        isDeepSearch,
        attachments,
        presetTone: settings.presetTone,
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text;
        setChats(prev => prev.map(c => {
          if (c.id === chatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === modelMessageId ? { ...m, text: fullText } : m),
            };
          }
          return c;
        }));
      }
      
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === modelMessageId ? { ...m, isStreaming: false } : m),
          };
        }
        return c;
      }));
    } catch (error: any) {
      console.error(error);
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === modelMessageId ? { ...m, error: error.message, isStreaming: false } : m),
          };
        }
        return c;
      }));
    }
  };

  const handleGenerateImage = async () => {
    const imagePrompt = window.prompt('Enter image description:');
    if (!imagePrompt) return;

    let chatId = currentChatId;
    if (!chatId) {
      chatId = Date.now().toString();
      const newChat: ChatSession = {
        id: chatId,
        title: imagePrompt.slice(0, 30) + '...',
        messages: [],
        updatedAt: Date.now(),
        isPrivate,
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: `Generate image: ${imagePrompt}`,
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) return { ...c, messages: [...c.messages, userMessage], updatedAt: Date.now() };
      return c;
    }));

    const modelMessageId = (Date.now() + 1).toString();
    const initialModelMessage: Message = {
      id: modelMessageId,
      role: 'model',
      text: '',
      isStreaming: true,
    };

    setChats(prev => prev.map(c => {
      if (c.id === chatId) return { ...c, messages: [...c.messages, initialModelMessage] };
      return c;
    }));

    try {
      const imageUrl = await generateImage(imagePrompt);
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === modelMessageId ? { ...m, imageUrl, isStreaming: false } : m),
          };
        }
        return c;
      }));
    } catch (error: any) {
      console.error(error);
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === modelMessageId ? { ...m, error: error.message, isStreaming: false } : m),
          };
        }
        return c;
      }));
    }
  };

  if (!isAuthenticated || showLandingPage) {
    return (
      <LandingPage 
        onConnect={handleConnect} 
        theme={settings.theme} 
        isAuthenticated={isAuthenticated}
        userEmail={localStorage.getItem('opencry_user_email') || ''}
        onClose={() => setShowLandingPage(false)}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#f5f4f0] dark:bg-[#121212] font-sans text-gray-900 dark:text-gray-100 overflow-hidden transition-colors">
      <Sidebar 
        onNewChat={handleNewChat} 
        settings={settings}
        setSettings={setSettings}
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onGoHome={() => setShowLandingPage(true)}
        isPrivate={isPrivate}
        setIsPrivate={setIsPrivate}
      />
      
      <main className="flex-1 flex flex-col relative h-full">
        {!currentChat ? (
          <div className="flex-1 flex flex-col items-center justify-center pb-32 animate-in fade-in duration-500">
            <Asterisk className="w-24 h-24 text-[#8b8575] dark:text-gray-400 mb-8" />
            <h1 className="font-['DotGothic16'] text-xl md:text-2xl tracking-[0.2em] text-gray-800 dark:text-gray-200 uppercase text-center max-w-lg leading-relaxed">
              HI I'M OPENCRY HOW CAN I HELP YOU TODAY
            </h1>
          </div>
        ) : (
          <ChatArea messages={currentChat.messages} />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f5f4f0] via-[#f5f4f0] dark:from-[#121212] dark:via-[#121212] to-transparent">
          <InputArea 
            onSend={handleSendMessage}
            isDeepSearch={isDeepSearch}
            setIsDeepSearch={setIsDeepSearch}
            isReasoning={isReasoning}
            setIsReasoning={setIsReasoning}
            onVoiceClick={() => setShowVoice(true)}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            onGenerateImage={handleGenerateImage}
          />
        </div>
      </main>

      {showVoice && <VoiceModal onClose={() => setShowVoice(false)} />}
    </div>
  );
}
