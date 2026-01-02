
import React, { useState, useEffect } from 'react';
import type { DataSet, Candidate, AdvancedPredictions, HitRecord, CombinedAnalysis, RectificationRecord, AppSettings } from './types';
import Header from './Header';
import ModuleInput from './ModuleInput';
import ResultDisplay from './ResultDisplay';
import CandidateDisplay from './CandidateDisplay';
import AdvancedPredictionDisplay from './AdvancedPredictionDisplay';
import StatisticsDisplay from './StatisticsDisplay';
import HistoryModal from './HistoryModal';
import ChatModule from './ChatModule';
import Loader from './Loader';
import { runGenerationCycle, parseModules } from './analysisService';
import { INITIAL_HISTORY } from './initialData';

const App: React.FC = () => {
    const [inputHistory, setInputHistory] = useState<DataSet[]>(() => JSON.parse(localStorage.getItem('dh_v25_history') || JSON.stringify(INITIAL_HISTORY)));
    const [hitsHistory, setHitsHistory] = useState<HitRecord[]>(() => JSON.parse(localStorage.getItem('dh_v25_hits') || '[]'));
    const [rectificationHistory, setRectificationHistory] = useState<RectificationRecord[]>(() => JSON.parse(localStorage.getItem('dh_v25_rect') || '[]'));
    const [settings, setSettings] = useState<AppSettings>(() => JSON.parse(localStorage.getItem('dh_v25_settings') || '{"entropy": 0.45, "voiceEnabled": true}'));
    
    const [m1, setM1] = useState<string[]>(() => JSON.parse(localStorage.getItem('dh_v25_m1') || '["","","","","","",""]'));
    const [m2, setM2] = useState<string[]>(() => JSON.parse(localStorage.getItem('dh_v25_m2') || '["","","","","","",""]'));
    const [m3, setM3] = useState<string[]>(() => JSON.parse(localStorage.getItem('dh_v25_m3') || '["","","","","","",""]'));

    const [generatedResult, setGeneratedResult] = useState<DataSet | null>(null);
    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [advancedPredictions, setAdvancedPredictions] = useState<AdvancedPredictions | null>(null);
    const [analysisData, setAnalysisData] = useState<CombinedAnalysis | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        localStorage.setItem('dh_v25_history', JSON.stringify(inputHistory));
        localStorage.setItem('dh_v25_hits', JSON.stringify(hitsHistory));
        localStorage.setItem('dh_v25_rect', JSON.stringify(rectificationHistory));
        localStorage.setItem('dh_v25_settings', JSON.stringify(settings));
        localStorage.setItem('dh_v25_m1', JSON.stringify(m1));
        localStorage.setItem('dh_v25_m2', JSON.stringify(m2));
        localStorage.setItem('dh_v25_m3', JSON.stringify(m3));
    }, [inputHistory, hitsHistory, rectificationHistory, settings, m1, m2, m3]);

    const speak = (text: string) => {
        if (!settings.voiceEnabled) return;
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'pt-BR';
        msg.rate = 0.85;
        msg.pitch = 0.7;
        window.speechSynthesis.speak(msg);
    };

    const handleGenerate = () => {
        if (isLoading || isLocked) return;
        setIsLoading(true);
        speak("Eu sou o Dark Horse. Iniciando colapso de onda quântica. Eliminando o impossível.");
        
        const parsed = parseModules([m1, m2, m3]);
        setTimeout(() => {
            const res = runGenerationCycle(parsed.modules, inputHistory, hitsHistory, rectificationHistory, settings.entropy);
            setGeneratedResult(res.result);
            setCandidates(res.candidates);
            setAdvancedPredictions(res.advancedPredictions);
            setAnalysisData(res.analysis);
            setIsLoading(false);
            setIsLocked(true); 
            speak("Manifestação concluída. O Oráculo isolou o padrão de ressonância.");
        }, 4500);
    };

    const handlePasteM3 = (v: string[]) => {
        setM1(m2); setM2(m3); setM3(v);
        const numericSet = v.map(line => line.split('').map(Number));
        setInputHistory(prev => [numericSet, ...prev].slice(0, 250));
        setIsLocked(false);
        speak("Onda Real sincronizada ao meu núcleo. Memória expandida.");
    };

    return (
        <div className="min-h-screen bg-[#010409] px-3 pt-2 pb-12 gap-3 text-slate-100 flex flex-col overflow-y-auto no-scrollbar selection:bg-amber-500/30 font-orbitron hologram-noise relative">
            <Header 
                onOpenHistory={() => setIsHistoryOpen(true)} 
                onOpenChat={() => setIsChatOpen(true)}
                isLoading={isLoading} 
            />
            
            <div className="bg-slate-900/40 p-5 rounded-[2.5rem] border border-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)] backdrop-blur-3xl oracle-glow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16"></div>
                <div className="flex justify-between mb-3 items-end">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.3em]">Protocolo de Incerteza</span>
                        <span className="text-[12px] text-amber-500 font-black">ENTROPIA ATIVA: {(settings.entropy * 100).toFixed(1)}%</span>
                    </div>
                    <button 
                        onClick={() => setSettings({...settings, voiceEnabled: !settings.voiceEnabled})}
                        className={`p-2 rounded-xl border transition-all shadow-lg ${settings.voiceEnabled ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    </button>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={settings.entropy} onChange={(e) => setSettings({...settings, entropy: parseFloat(e.target.value)})} className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-full" />
            </div>

            <div className="module-grid">
                <ModuleInput id="1" title="ALPHA-CORE" values={m1} setValues={setM1} readOnly />
                <ModuleInput id="2" title="BETA-SYNC" values={m2} setValues={setM2} readOnly />
                <ModuleInput id="3" title="ONDA-REAL" values={m3} setValues={(v) => {setM3(v); setIsLocked(false);}} onPaste={handlePasteM3} onClear={() => {setM3(Array(7).fill("")); speak("Memória de onda limpa.");}} />
            </div>

            <button onClick={handleGenerate} disabled={isLoading || isLocked} className={`w-full py-8 font-black rounded-[3rem] uppercase tracking-[0.4em] border-2 transition-all text-[11px] relative overflow-hidden group ${isLoading || isLocked ? 'bg-slate-900/50 border-slate-800 text-slate-700' : 'bg-slate-950 border-amber-600 text-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)] active:scale-95'}`}>
                <div className="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                {isLoading ? 'DARK HORSE PENSANDO...' : isLocked ? 'SISTEMA BLOQUEADO' : 'MANIFESTAR ORÁCULO'}
            </button>

            {isLoading ? <Loader /> : (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <StatisticsDisplay analysis={analysisData} isLoading={isLoading} />
                    <ResultDisplay result={generatedResult} onMarkHit={(v, t, p, s) => setHitsHistory(prev => [{id: crypto.randomUUID(), value: v, type: t, position: p, status: s || 'Acerto', timestamp: Date.now()}, ...prev])} onManualRectify={(g, a, t, l) => setRectificationHistory(prev => [{id: crypto.randomUUID(), generated: g, actual: a, type: t, rankLabel: l, timestamp: Date.now()}, ...prev])} />
                    <AdvancedPredictionDisplay predictions={advancedPredictions} onMarkHit={(v, t, p, s) => setHitsHistory(prev => [{id: crypto.randomUUID(), value: v, type: t, position: p, status: s || 'Acerto', timestamp: Date.now()}, ...prev])} onManualRectify={(g, a, t, l) => setRectificationHistory(prev => [{id: crypto.randomUUID(), generated: g, actual: a, type: t, rankLabel: l, timestamp: Date.now()}, ...prev])} />
                    <CandidateDisplay candidates={candidates} onMarkHit={(v, t, p, s) => setHitsHistory(prev => [{id: crypto.randomUUID(), value: v, type: t, position: p, status: s || 'Acerto', timestamp: Date.now()}, ...prev])} onManualRectify={(g, a, t, l) => setRectificationHistory(prev => [{id: crypto.randomUUID(), generated: g, actual: a, type: t, rankLabel: l, timestamp: Date.now()}, ...prev])} />
                </div>
            )}

            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} inputHistory={inputHistory} onClearInputHistory={() => setInputHistory([])} onDeleteInputItem={(i) => setInputHistory(prev => prev.filter((_, idx) => idx !== i))} generatedHistory={[]} onClearGeneratedHistory={() => {}} onDeleteGeneratedItem={() => {}} hitsHistory={hitsHistory} onClearHitsHistory={() => setHitsHistory([])} onDeleteHitItem={(i) => setHitsHistory(prev => prev.filter((_, idx) => idx !== i))} rectificationHistory={rectificationHistory} onClearRectificationHistory={() => setRectificationHistory([])} onDeleteRectificationItem={(i) => setRectificationHistory(prev => prev.filter((_, idx) => idx !== i))} />
            
            <ChatModule 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
              voiceEnabled={settings.voiceEnabled}
              onSpeak={speak}
            />
        </div>
    );
};

export default App;
