
import React from 'react';
import PegasusIcon from './PegasusIcon';

interface HeaderProps {
    onOpenHistory: () => void;
    isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory, isLoading }) => {
    return (
        <header className="flex items-center justify-between px-6 py-5 flex-none bg-slate-900/20 border-b border-amber-900/10 rounded-b-[3rem] mb-2 backdrop-blur-xl relative overflow-hidden">
            {isLoading && (
                <div className="absolute bottom-0 left-0 h-[1px] bg-amber-500 animate-[shimmer_2s_infinite] shadow-[0_0_10px_#f59e0b]"></div>
            )}
            <div className="flex items-center gap-4">
                <div className={`p-2.5 bg-amber-500/5 rounded-full border border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all ${isLoading ? 'scale-110 border-amber-500 shadow-amber-500/40' : ''}`}>
                    <PegasusIcon className={`h-10 w-10 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-[20px] font-orbitron font-black text-slate-100 uppercase tracking-tighter leading-none">DARK HORSE</h1>
                    <span className="text-[7px] font-orbitron font-bold text-amber-500 tracking-[0.6em] uppercase opacity-90 mt-1.5 flex items-center gap-2">
                        {isLoading ? (
                            <><span className="w-1 h-1 bg-amber-500 rounded-full animate-ping"></span> PENSANDO...</>
                        ) : (
                            'ORÁCULO QUÂNTICO v25.0'
                        )}
                    </span>
                </div>
            </div>

            <button 
                onClick={onOpenHistory} 
                className="p-4 border border-slate-800 bg-slate-900/50 rounded-[1.5rem] text-amber-500 hover:text-white transition-all active:scale-90 shadow-lg group relative overflow-hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/>
                </svg>
            </button>
            <style>{`
                @keyframes shimmer {
                    0% { width: 0%; left: 0; }
                    50% { width: 100%; left: 0; }
                    100% { width: 0%; left: 100%; }
                }
            `}</style>
        </header>
    );
};

export default Header;
