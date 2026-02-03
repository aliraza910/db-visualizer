'use client';
import React from 'react';
import { Zap } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const SQLOptimizer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="SQL Optimizer" icon={Zap} onBack={onBack}>
            <section className="space-y-6 text-left">
                <h2 className="text-2xl font-black tracking-tight">Performance Engineering for Schemas</h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Optimizing a database starts with the schema itself. Badly typed columns or missing indexes can slow down an application by 100x. Here's what we look for when you upload your DDL.
                </p>
                
                <div className="grid gap-6">
                    {[
                        { title: 'Index Distribution', desc: 'Every foreign key should ideally have an index. Our optimizer checks if your referencing columns are prepared for high-speed joins.' },
                        { title: 'Data Type precision', desc: 'Using BIGINT when INT suffices, or TEXT instead of VARCHAR(255), wastes storage and increases I/O. We suggest the leanest types for your data.' },
                        { title: 'Scan Prevention', desc: 'By analyzing your relationship density, we can predict which tables are at risk of sequential scans and suggest compound primary keys.' }
                    ].map((item, i) => (
                        <div key={i} className="flex space-x-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="text-blue-600 font-black text-xl">0{i+1}</div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 uppercase text-xs tracking-wider">{item.title}</h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl border border-slate-800 text-left">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 text-left">Pro Optimization Tip</h3>
                    <code className="text-xs font-mono leading-relaxed block text-left">
                        -- Avoid SELECT * in high-concurrency systems.<br/>
                        -- Use DB Visualizer's Query Builder to generate targeted SELECT statements.<br/>
                        -- Ensure covered indexes are used for the most frequent search predicates.
                    </code>
                </div>
            </section>
        </PageLayout>
    );
};
