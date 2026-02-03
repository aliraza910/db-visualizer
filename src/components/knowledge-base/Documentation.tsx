'use client';
import React from 'react';
import { Book, ChevronRight } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const Documentation: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="Documentation" icon={Book} onBack={onBack}>
            <section className="space-y-12 text-left">
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight">Getting Started with DB Visualizer</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">The fastest way to understand a complex backend is to see it. Follow these steps to master the platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 text-left">
                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">Step 1: Ingesting Data</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Drop any `.sql` file into the uploader. Our parser will automatically identify tables and relationships. You can also use the "Table Architect" for manual design.</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 text-left">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Step 2: Navigation</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Use the "Registry" in the sidebar to search for specific columns. Click a table to center it in the view. Use the mouse wheel to zoom for a bird's-eye schema view.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-6 text-left">
                   <h3 className="text-sm font-black uppercase tracking-widest text-left">Advanced Features</h3>
                   <ul className="grid gap-4 text-left">
                       {[
                           'Interactive Query Builder: Click column names to build SELECT statements on the fly.',
                           'High-Res Export: Download vector-perfect PNG diagrams for meetings and docs.',
                           'Theme Switcher: Toggle between Midnight, Mono, and Forest modes for high-contrast viewing.',
                           'History Tracking: Automatically save your session recents to your local browser storage.'
                       ].map((text, i) => (
                           <li key={i} className="flex items-start space-x-3 text-left">
                               <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                               <span className="text-[11px] font-medium text-slate-500">{text}</span>
                           </li>
                       ))}
                   </ul>
                </div>
            </section>
        </PageLayout>
    );
};
