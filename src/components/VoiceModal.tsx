import { useState, useRef } from 'react';
import { X, Mic, Square } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

export default function VoiceModal({ onClose }: { onClose: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are open, a helpful voice assistant.",
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            startAudioCapture(sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              playAudioChunk(base64Audio);
            }
            if (message.serverContent?.interrupted) {
              playbackQueueRef.current = [];
            }
          },
          onclose: () => {
            setIsConnected(false);
            stopAudioCapture();
          }
        }
      });
      
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start voice session", err);
    }
  };

  const startAudioCapture = async (sessionPromise: Promise<any>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        const buffer = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < buffer.byteLength; i++) {
          binary += String.fromCharCode(buffer[i]);
        }
        const base64Data = btoa(binary);
        
        sessionPromise.then((session) => {
          session.sendRealtimeInput([{
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          }]);
        });
      };
      
      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
      processorRef.current = processor;
      setIsRecording(true);
    } catch (err) {
      console.error("Audio capture failed", err);
    }
  };

  const stopAudioCapture = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsRecording(false);
  };

  const playAudioChunk = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    
    playbackQueueRef.current.push(float32Array);
    if (!isPlayingRef.current) {
      processPlaybackQueue();
    }
  };

  const processPlaybackQueue = () => {
    if (playbackQueueRef.current.length === 0 || !audioContextRef.current) {
      isPlayingRef.current = false;
      return;
    }
    isPlayingRef.current = true;
    const chunk = playbackQueueRef.current.shift()!;
    const audioBuffer = audioContextRef.current.createBuffer(1, chunk.length, 24000);
    audioBuffer.getChannelData(0).set(chunk);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => processPlaybackQueue();
    source.start();
  };

  const handleClose = () => {
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
    }
    stopAudioCapture();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-colors">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center p-8 relative border border-gray-200 dark:border-gray-800">
        <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-8 relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 animate-ping opacity-20"></div>
          )}
          <Mic className={`w-10 h-10 ${isRecording ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {isConnected ? "Listening..." : "Voice Assistant"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-10">
          {isConnected ? "Speak naturally to open." : "Click start to begin conversation."}
        </p>
        
        {!isConnected ? (
          <button 
            onClick={startSession}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Start Conversation
          </button>
        ) : (
          <button 
            onClick={handleClose}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" /> End Conversation
          </button>
        )}
      </div>
    </div>
  );
}
