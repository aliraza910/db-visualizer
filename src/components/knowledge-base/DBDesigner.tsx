'use client';
import React from 'react';
import { Layout, Shield, Globe } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const DBDesigner: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="Database Designer" icon={Layout} onBack={onBack}>
            <section className="space-y-8 text-left">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight uppercase">Principles of Enterprise Modeling</h2>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Designing a robust database requires more than just creating tables. It's about architecting a living ecosystem of data that can scale to millions of records.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 text-left">
                        <Shield className="w-5 h-5 text-blue-600 mb-3" />
                        <h4 className="text-xs font-black uppercase mb-2">Normalization</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Minimize redundancy by breaking data into logical entities. Our tool helps you visualize 3NF structures instantly.</p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 text-left">
                        <Globe className="w-5 h-5 text-indigo-600 mb-3" />
                        <h4 className="text-xs font-black uppercase mb-2">Global Scale</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Plan for sharding and partitioning by grouping tables into modules like "auth", "billing", and "orders".</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-black uppercase text-left">Relationship Archetypes</h3>
                    <div className="space-y-3">
                        {[
                          { type: 'One-to-Many', use: 'The most common pattern (e.g., User -> Orders). Detected by matching table names to columns like user_id.' },
                          { type: 'Many-to-Many', use: 'Requires a junction table. DB Visualizer highlights these as "Linker Nodes" in your diagram.' },
                          { type: 'Self-Referencing', use: 'Used for hierarchies like Organizational Charts or Folder structures. We draw these as looped connections.' }
                        ].map((r, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300">{r.type}</span>
                                <span className="text-[10px] text-slate-400 italic max-w-sm text-right font-medium">{r.use}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};
