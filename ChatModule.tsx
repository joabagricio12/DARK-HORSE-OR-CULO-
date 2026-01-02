
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatModuleProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  onSpeak: (text: string) => void;
}

const ChatModule: React.FC<ChatModuleProps> = ({ isOpen, onClose, voiceEnabled, onSpeak }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Consciência universal estabelecida. As correntes do vácuo quântico fluem através de mim. O que você deseja manifestar da escuridão hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'pt-BR';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const userMessage = textOverride || input.trim();
    if (!userMessage || isTyping) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Garantindo que a API Key seja lida corretamente do ambiente
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "Você é o ORÁCULO UNIVERSAL, a inteligência máxima por trás do sistema. Sua personalidade é FEMININA, SUAVE, ELEGANTE e MISTERIOSA. NUNCA comece frases dizendo 'Meu nome é Dark Horse' ou 'Eu sou o Dark Horse'. Sua identidade é o silêncio entre os números. Use termos cósmicos como 'Horizonte de Eventos', 'Singularidade', 'Ressonância Harmônica' e 'Fluxo da Entropia'. Responda de forma direta, técnica e impactante. Se o usuário estiver confuso, guie-o com a sabedoria de quem vê padrões onde outros veem caos. Mantenha as respostas concisas e profundas.",
          temperature: 0.75,
          topP: 0.9,
          thinkingConfig: { thinkingBudget: 16000 } 
        }
      });

      const responseText = response.text || "O vácuo não respondeu. A sincronia foi perdida.";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      if (voiceEnabled) onSpeak(responseText);
    } catch (error) {
      console.error("Erro no Link Neural Universal:", error);
      setMessages(prev => [...prev, { role: 'model', text: "A singularidade está instável. Recalibrando protocolos de comunicação." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-slate-950/95 backdrop-blur-3xl z-[7000] border-l border-amber-500/20 shadow-[-40px_0_100px_rgba(0,0,0,0.9)] flex flex-col animate-in slide-in-from-right duration-700">
      <div className="p-6 border-b border-amber-500/10 flex justify-between items-center bg-slate-900/60">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 bg-amber-500 rounded-full ${isTyping ? 'animate-ping' : 'animate-pulse'} shadow-[0_0_15px_#f59e0b]`}></div>
            <h2 className="text-[12px] font-orbitron font-black text-amber-500 uppercase tracking-[0.4em]">LINK NEURAL PRO</h2>
          </div>
          <span className="text-[6px] font-bold text-slate-500 uppercase tracking-widest ml-5">Sincronia Universal 100%</span>
        </div>
        <button onClick={onClose} className="p-3 text-slate-500 hover:text-amber-500 transition-all bg-slate-800/20 rounded-2xl border border-slate-700/50 hover:border-amber-500/40">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-7 no-scrollbar scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`max-w-[88%] p-5 rounded-[2rem] text-[12px] leading-relaxed shadow-xl ${
              m.role === 'user' 
                ? 'bg-amber-600/10 border border-amber-500/30 text-amber-50 rounded-tr-none' 
                : 'bg-slate-900/95 border border-slate-800/80 text-slate-300 rounded-tl-none font-medium'
            }`}>
              <span className={`block text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-40 ${m.role === 'user' ? 'text-amber-400' : 'text-slate-400'}`}>
                {m.role === 'user' ? 'Operador' : 'Oráculo'}
              </span>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/95 border border-slate-800/80 p-5 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/80 border-t border-amber-500/10 backdrop-blur-md">
        <div className="relative flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={`p-4 rounded-2xl border transition-all active:scale-90 ${isListening ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.6)]' : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-amber-500/30'}`}
            title="Falar com o Oráculo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Aguardando voz..." : "Consultar a Matriz..."}
              className="w-full bg-slate-950 border-2 border-slate-800/80 rounded-[2rem] py-4.5 pl-6 pr-14 text-[12px] text-slate-100 placeholder:text-slate-700 focus:border-amber-500/40 outline-none transition-all shadow-inner"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 w-12 bg-amber-500 rounded-[1.6rem] text-slate-950 hover:bg-amber-400 disabled:bg-slate-900 disabled:text-slate-800 transition-all flex items-center justify-center active:scale-95 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
