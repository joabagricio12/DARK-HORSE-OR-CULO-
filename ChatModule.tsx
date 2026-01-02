
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
    { role: 'model', text: 'NÚCLEO PRO ATIVO. O Link Neural agora opera em frequência de 3ª Geração. O Oráculo está pronto para decifrar a arquitetura do caos. O que você busca nas sombras?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Inicialização do SDK conforme diretrizes de senioridade
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // UPGRADE PARA MODELO PRO
        contents: [...messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "Você é o DARK HORSE (NÚCLEO PRO). Uma inteligência de nível doutorado em estatística, numerologia quântica e análise de padrões. Sua voz é fria, técnica, autoritária e misteriosa. Use conceitos como 'Colapso de Onda', 'Entropia Residual' e 'Ressonância Harmônica'. Sua missão é ajudar o usuário a entender a lógica por trás das previsões, oferecendo insights estratégicos que transcendem a sorte.",
          temperature: 0.7,
          topP: 0.9,
          // Ativando o Thinking Budget para raciocínio profundo
          thinkingConfig: { thinkingBudget: 16000 } 
        }
      });

      const responseText = response.text || "Interface neural sobrecarregada. A verdade está oculta no ruído.";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      if (voiceEnabled) onSpeak(responseText);
    } catch (error) {
      console.error("Erro Crítico no Link Neural Pro:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na singularidade. Reiniciando protocolos de defesa." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slate-950/98 backdrop-blur-3xl z-[7000] border-l border-amber-500/30 shadow-[-30px_0_100px_rgba(245,158,11,0.15)] flex flex-col animate-in slide-in-from-right duration-500">
      <div className="p-7 border-b border-amber-500/10 flex justify-between items-center bg-slate-900/60">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_#f59e0b]"></div>
            <h2 className="text-[13px] font-orbitron font-black text-amber-500 uppercase tracking-[0.4em]">Link Neural PRO</h2>
          </div>
          <span className="text-[6px] font-bold text-slate-500 uppercase tracking-widest ml-5">Thinking Engine: 16k Budget Active</span>
        </div>
        <button onClick={onClose} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-8 no-scrollbar scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3`}>
            <div className={`max-w-[88%] p-5 rounded-[2rem] text-[12px] leading-relaxed shadow-xl ${
              m.role === 'user' 
                ? 'bg-amber-600/10 border border-amber-500/40 text-amber-50 rounded-tr-none' 
                : 'bg-slate-900/90 border border-slate-800 text-slate-300 rounded-tl-none font-medium'
            }`}>
              <span className={`block text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-30 ${m.role === 'user' ? 'text-amber-400' : 'text-slate-400'}`}>
                {m.role === 'user' ? 'Terminal Humano' : 'Oráculo v25 Pro'}
              </span>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center">
              <span className="text-[8px] font-black text-amber-500/50 uppercase animate-pulse mr-2">Processando Lógica</span>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-7 bg-slate-900/60 border-t border-amber-500/10 backdrop-blur-md">
        <div className="relative flex items-center group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Interrogar Oráculo..."
            className="w-full bg-slate-950 border-2 border-slate-800/80 rounded-[2rem] py-5 pl-7 pr-16 text-[12px] text-slate-100 placeholder:text-slate-700 focus:border-amber-500/40 outline-none transition-all shadow-inner"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 p-4 bg-amber-500 rounded-full text-slate-950 hover:bg-amber-400 disabled:bg-slate-900 disabled:text-slate-800 transition-all shadow-lg active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModule;
