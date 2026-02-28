import { useState, useRef, useEffect } from 'react';
import { Paperclip, Globe, Lightbulb, ArrowUp, X, ChevronDown, ImageIcon } from 'lucide-react';
import { Attachment, ModelType } from '../types';

export default function InputArea({ 
  onSend, 
  isDeepSearch, 
  setIsDeepSearch, 
  isReasoning, 
  setIsReasoning,
  onVoiceClick,
  selectedModel,
  setSelectedModel,
  onGenerateImage
}: {
  onSend: (text: string, attachments: Attachment[]) => void;
  isDeepSearch: boolean;
  setIsDeepSearch: (val: boolean) => void;
  isReasoning: boolean;
  setIsReasoning: (val: boolean) => void;
  onVoiceClick: () => void;
  selectedModel: ModelType;
  setSelectedModel: (m: ModelType) => void;
  onGenerateImage: () => void;
}) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [showModelSelect, setShowModelSelect] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setShowModelSelect(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }

    const words = val.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      setShowMentions(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (selectedMode: 'search' | 'reason') => {
    if (selectedMode === 'search') {
      setIsDeepSearch(true);
    } else if (selectedMode === 'reason') {
      setIsReasoning(true);
    }
    
    const words = text.split(' ');
    words.pop();
    setText(words.join(' ') + (words.length > 0 ? ' ' : ''));
    setShowMentions(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSend(text, attachments);
    setText('');
    setAttachments([]);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments(prev => [...prev, {
          type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
          url: URL.createObjectURL(file),
          mimeType: file.type,
          data: event.target?.result as string,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const mentionOptions = [
    { id: 'search', icon: Globe, label: 'Deep Search', desc: 'Use Google Search data' },
    { id: 'reason', icon: Lightbulb, label: 'Reason Mode', desc: 'Think more when needed' },
  ].filter(o => o.label.toLowerCase().includes(mentionFilter) || o.id.includes(mentionFilter));

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col gap-2">
      <div className="flex items-center justify-between px-2 mb-1">
        <div className="relative" ref={modelRef}>
          <button 
            onClick={() => setShowModelSelect(!showModelSelect)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {selectedModel} <ChevronDown className="w-4 h-4" />
          </button>
          
          {showModelSelect && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-20">
              <button
                onClick={() => { setSelectedModel('opencry 1.0'); setShowModelSelect(false); }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedModel === 'opencry 1.0' ? 'font-medium text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                opencry 1.0
                <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">Fastest model for everyday tasks</div>
              </button>
              <button
                onClick={() => { setSelectedModel('opencry 1.2 max'); setShowModelSelect(false); }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-gray-100 dark:border-gray-800 ${selectedModel === 'opencry 1.2 max' ? 'font-medium text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                opencry 1.2 max
                <div className="text-xs text-gray-400 dark:text-gray-500 font-normal mt-0.5">Most capable model for complex tasks</div>
              </button>
            </div>
          )}
        </div>
      </div>

      {showMentions && (
        <div className="absolute bottom-full mb-4 left-4 w-64 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden z-20">
          <div className="p-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            Select Tool
          </div>
          {mentionOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleMentionSelect(option.id as any)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
                <option.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
              </div>
            </button>
          ))}
          {mentionOptions.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">No tools found</div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-[#1e1e1e] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 p-2 flex flex-col transition-all duration-200 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden">
        {attachments.length > 0 && (
          <div className="flex gap-2 px-4 pt-2 pb-1 overflow-x-auto">
            {attachments.map((att, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 group">
                {att.type === 'image' ? (
                  <img src={att.url} alt="attachment" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    {att.type}
                  </div>
                )}
                <button 
                  onClick={() => removeAttachment(i)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <textarea 
          ref={inputRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent resize-none outline-none px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 max-h-[200px] overflow-y-auto"
          placeholder="Ask anything"
          rows={1}
        />
        
        <div className="flex items-center justify-between px-2 pb-1 pt-1">
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              multiple 
              accept="image/*,video/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group relative"
            >
              <Paperclip className="w-4 h-4" />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Upload</span>
            </button>
            
            <button 
              onClick={() => setIsDeepSearch(!isDeepSearch)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors group relative ${isDeepSearch ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Globe className="w-3.5 h-3.5" /> Deep Search
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Toggle Search</span>
            </button>
            
            <button 
              onClick={() => setIsReasoning(!isReasoning)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors group relative ${isReasoning ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white' : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Reason
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Toggle Reason</span>
            </button>

            <button 
              onClick={onGenerateImage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group relative"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Image
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Generate Image</span>
            </button>

            <button 
              onClick={onVoiceClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> Voice
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Voice Assistant</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSend}
              disabled={!text.trim() && attachments.length === 0}
              className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
            >
              <ArrowUp className="w-5 h-5" />
              <span className="absolute bottom-full mb-2 right-0 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Send (Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
