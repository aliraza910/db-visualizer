'use client';
import React from 'react';
import { Layers } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const APIRef: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="API Reference" icon={Layers} onBack={onBack}>
            <section className="space-y-12 text-left">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight">Developer Integration</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">The DB Visualizer engine is built on a modular REST API. Enterprise users can programmatically post DDL to generate visual metadata.</p>
                </div>

                <div className="space-y-8 text-left">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-left">
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded">POST</span>
                            <span className="text-slate-300 text-[10px]">/api/upload</span>
                        </div>
                        <p className="text-slate-500 text-[10px] mb-4">// Form-data: {`{ file: File }`}</p>
                        <pre className="text-blue-400 text-[10px] overflow-x-auto text-left">
{`{
  "tables": [...],
  "nodes": [...],
  "edges": [...],
  "stats": {
    "tableCount": 12,
    "relationshipCount": 18
  }
}`}
                        </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                             <h4 className="text-[10px] font-black uppercase text-blue-600 mb-2">Rate Limits</h4>
                             <p className="text-[10px] font-medium text-slate-500">10,000 requests per hour for Enterprise keys. Unlimited parsing on local instances.</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                             <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-2">Auth Security</h4>
                             <p className="text-[10px] font-medium text-slate-500">All uploads are processed in-memory and destroyed immediately after JSON response.</p>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};
