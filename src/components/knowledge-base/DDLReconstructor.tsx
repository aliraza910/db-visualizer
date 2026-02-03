'use client';
import React from 'react';
import { Code, Cpu } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const DDLReconstructor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="DDL Reconstructor" icon={Code} onBack={onBack}>
            <section className="space-y-12 text-left">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight">Reverse Engineering Complexity</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                        SQL is a flexible language, but visualization requires structure. Our DDL Reconstructor uses advanced AST (Abstract Syntax Tree) parsing to turn raw text into actionable data models.
                    </p>
                </div>

                <div className="relative p-8 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 text-left">
                    <div className="absolute top-0 right-0 p-4">
                        <Cpu className="w-12 h-12 text-blue-600/20" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6 font-medium text-left">The Reconstruction Pipeline</h3>
                    <div className="space-y-6 relative text-left">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800" />
                        {[
                            { step: 'Tokenization', detail: 'We break your SQL into keywords, operators, and identifiers, stripping away comments and non-structural code.' },
                            { step: 'AST Generation', detail: 'The tokens are arranged into a tree structure that represents the logical intent of the CREATE TABLE statement.' },
                            { step: 'Heuristic Mapping', detail: 'Our engine bridges the gap between different SQL dialects (MySQL, Postgres, SQLite) to find a universal schema representation.' },
                            { step: 'Visual Materialization', detail: 'Nodes and Edges are generated with optimized positioning for the final ER Diagram.' }
                        ].map((s, i) => (
                            <div key={i} className="flex items-start space-x-6 relative text-left">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 z-10 shadow-lg shadow-blue-500/50">
                                    {i+1}
                                </div>
                                <div className="space-y-1 text-left">
                                    <h4 className="text-xs font-black uppercase text-slate-100">{s.step}</h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};
