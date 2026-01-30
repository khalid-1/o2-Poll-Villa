import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, MoreVertical, Download, Smartphone } from 'lucide-react';

export function InstallPrompt({ onBypass }) {
    const [os, setOs] = useState('ios');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Initial Detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/android/.test(userAgent)) {
            setOs('android');
        } else {
            setOs('ios');
        }

        // Capture Android install prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-stone-950 via-neutral-950 to-black flex flex-col items-center justify-center p-6 text-white overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-stone-900/40 rounded-full blur-[120px] animate-pulse-soft"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-neutral-900/40 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 max-w-sm w-full bg-neutral-900/80 backdrop-blur-2xl text-stone-200 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] animate-fade-in-up overflow-hidden border border-white/5">
                {/* Header Section */}
                <div className="pt-12 pb-10 px-8 text-center relative">
                    <div className="w-32 h-32 mx-auto mb-8 relative group">
                        {/* Glow Effect - Blue Accent */}
                        <div className="absolute inset-0 bg-blue-500/30 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 scale-110 blur-xl"></div>

                        {/* Logo Container - White Background for SVG with Blue Shadow */}
                        <div className="relative z-10 w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-500 border border-white/90">
                            {/* Placeholder for Logo */}
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                O2
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-black mb-3 tracking-tight text-white leading-tight">Install Admin</h1>
                    <p className="text-neutral-400 font-medium leading-relaxed px-2 text-sm">
                        Manage O2 Poll Villa as a <span className="text-blue-500 font-bold">native application</span> on your device.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 mx-8 mb-8 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <button
                        onClick={() => setOs('ios')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${os === 'ios'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        iOS
                    </button>
                    <button
                        onClick={() => setOs('android')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${os === 'android'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                    >
                        <Smartphone size={16} />
                        Android
                    </button>
                </div>

                <div className="px-10 pb-12">
                    {os === 'ios' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner border border-white/5">
                                    <Share size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Step 1</p>
                                    <p className="text-sm font-bold text-neutral-200">Tap the <span className="text-white">Share</span> icon</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner border border-white/5">
                                    <PlusSquare size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Step 2</p>
                                    <p className="text-sm font-bold text-neutral-200">Select <span className="text-white uppercase text-xs">Add to Home Screen</span></p>
                                </div>
                            </div>
                        </div>
                    )}

                    {os === 'android' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner border border-white/5">
                                    <MoreVertical size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Step 1</p>
                                    <p className="text-sm font-bold text-neutral-200">Tap the <span className="text-white">Menu</span> dots</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-inner border border-white/5">
                                    <Download size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Step 2</p>
                                    <p className="text-sm font-bold text-neutral-200">Tap <span className="text-white">Install App</span></p>
                                </div>
                            </div>

                            {deferredPrompt && (
                                <button
                                    onClick={handleInstallClick}
                                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4 text-sm uppercase tracking-wider"
                                >
                                    <Download size={20} />
                                    Install Now
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onBypass}
                        className="mt-12 text-[10px] text-neutral-500 hover:text-white transition-colors font-black uppercase tracking-[0.2em] w-full text-center"
                    >
                        Continue in browser
                    </button>
                </div>
            </div>
        </div>
    );
}
