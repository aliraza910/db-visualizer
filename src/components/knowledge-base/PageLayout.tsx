'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  onBack: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, icon: Icon, children, onBack }) => {
    return (
        <div className="flex-1 w-full bg-white dark:bg-slate-950 overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="max-w-5xl mx-auto py-20 px-6">
                <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Architect</span>
                </button>
                
                <div className="flex items-center space-x-4 mb-16">
                    <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20">
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mt-2">Enterprise Knowledge base</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        {children}
                    </div>
                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Quick Stats</h4>
                             <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-black text-blue-600">98%</div>
                                    <div className="text-[9px] font-bold uppercase text-slate-400">Accuracy Rate</div>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">1.2ms</div>
                                    <div className="text-[9px] font-bold uppercase text-slate-400">Parsing Latency</div>
                                </div>
                             </div>
                        </div>
                        
                        <div className="bg-blue-600 p-8 rounded-3xl shadow-2xl shadow-blue-500/30 text-white space-y-4 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                             <h4 className="text-lg font-black leading-tight">Ready to visualize?</h4>
                             <p className="text-[10px] font-medium opacity-80 leading-relaxed">Stop reading and start building. Our architect is ready for your SQL DDL.</p>
                             <button onClick={onBack} className="w-full py-3 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                Launch Tool
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
