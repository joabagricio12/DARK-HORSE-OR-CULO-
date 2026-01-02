
import React, { useState, useRef, useEffect } from 'react';
import type { DataSet } from './types';

interface ResultDisplayProps {
    result: DataSet | null;
    onMarkHit: (value: string, type: 'Milhar' | 'Centena', position: number, status?: 'Acerto' | 'Quase Acerto') => void;
    onManualRectify: (gen: string, act: string, type: 'Milhar' | 'Centena', rankLabel: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onMarkHit, onManualRectify }) => {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [localVal, setLocalVal] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (openMenu !== null && inputRef.current) {
            const timer = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        }
    }, [openMenu]);

    const getRankLabel = (idx: number) => {
        if (idx === 0) return "1º Prêmio (Elite)";
        if (idx === 6) return "7º Prêmio (Centena)";
        return `${idx + 1}º Prêmio`;
    };

    const displayData = result || Array(7).fill(null).map((_, i) => i === 6 ? [0, 0, 0] : [0, 0, 0, 0]);

    return (
        <div className="bg-slate-900/60 p-5 rounded-[2.5rem] border border-amber-900/20 shadow-2xl relative backdrop-blur-3xl flex flex-col gap-4 overflow-hidden">
            {/* Overlay de Brilho Quântico */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 blur-[100px] pointer-events-none"></div>
            
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_#f59e0b] ${result ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`}></div>
                    <h2 className="text-[11px] font-orbitron font-black text-amber-500 uppercase tracking-[0.3em] leading-none">MATRIZ MANIFESTADA</h2>
                </div>
                {result && <span className="text-[7px] font-black text-amber-600/50 uppercase tracking-widest animate-pulse">Onda Estável</span>}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {displayData.map((row, idx) => {
                    const value = result ? row.join('') : (idx === 6 ? "---" : "----");
                    const type = idx === 6 ? 'Centena' : 'Milhar';
                    const isTop = idx < 3;
                    const rankLabel = getRankLabel(idx);
                    
                    return (
                        <div 
                            key={idx} 
                            style={{ animationDelay: `${idx * 150}ms` }}
                            className={`group relative p-3 rounded-[1.8rem] border flex flex-col items-center justify-center transition-all duration-700 ${result ? 'animate-in fade-in slide-in-from-top-2' : ''} ${isTop ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'bg-slate-950/50 border-slate-800/80'} ${!result && 'opacity-30 grayscale'}`}
                        >
                            <span className={`text-[8px] font-black mb-2 uppercase tracking-tighter ${isTop ? 'text-amber-500' : 'text-slate-600'}`}>{idx === 0 ? 'ELITE' : `${idx + 1}º`}</span>
                            <div className={`font-orbitron text-[20px] font-black tracking-tighter leading-none mb-3 drop-shadow-md ${isTop ? 'text-amber-400' : 'text-slate-100'}`}>{value}</div>

                            <button 
                                disabled={!result}
                                onClick={() => { setOpenMenu(idx); setLocalVal(""); }} 
                                className={`p-2 rounded-xl relative z-[45] transition-all shadow-lg ${!result ? 'bg-slate-800 text-slate-700' : (isTop ? 'bg-amber-500 text-slate-950 hover:scale-110 active:scale-90' : 'bg-slate-800 text-slate-400 hover:text-amber-500')}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
                            </button>

                            {openMenu === idx && (
                                <div onClick={(e) => e.stopPropagation()} className="fixed md:absolute top-1/2 left-1/2 md:top-[-40px] md:left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 w-[90vw] max-w-[260px] bg-slate-950 rounded-[2.5rem] z-[9999] p-6 flex flex-col gap-4 border-2 border-amber-500 shadow-[0_0_80px_rgba(245,158,11,0.6)] animate-in zoom-in duration-300 backdrop-blur-3xl">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">SINCRONIA REAL</span>
                                            <span className="text-[7px] text-slate-500 font-bold uppercase">{rankLabel}</span>
                                        </div>
                                        <button onClick={() => setOpenMenu(null)} className="w-8 h-8 flex items-center justify-center bg-slate-900 rounded-xl text-amber-500 border border-amber-500/30 text-[20px] font-bold">×</button>
                                    </div>
                                    <input ref={inputRef} type="text" placeholder="VALOR REAL" value={localVal} onChange={(e) => setLocalVal(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-900 border-2 border-slate-800 text-center font-orbitron text-[24px] py-4 rounded-2xl text-amber-500 outline-none focus:border-amber-500 placeholder:text-slate-800" maxLength={idx === 6 ? 3 : 4} inputMode="numeric" />
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => { onMarkHit(value, type, idx + 1, 'Acerto'); setOpenMenu(null); }} className="w-full bg-amber-500 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_4px_0_#b45309] active:translate-y-[2px] active:shadow-none">SALVAR ACERTO</button>
                                        <button onClick={() => { onMarkHit(value, type, idx + 1, 'Quase Acerto'); setOpenMenu(null); }} className="w-full bg-slate-900 border border-amber-500/50 text-amber-500 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest active:scale-95">QUASE ACERTO</button>
                                        <button onClick={() => { if (localVal) { onManualRectify(value, localVal, type, rankLabel); setOpenMenu(null); } }} className="w-full bg-amber-950/40 text-amber-400 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-amber-500/20 active:scale-95">RETIFICAR IA</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResultDisplay;
