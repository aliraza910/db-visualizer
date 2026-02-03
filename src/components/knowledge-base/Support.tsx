'use client';
import React from 'react';
import { Shield, Lock, MessageSquare, Globe } from 'lucide-react';
import { PageLayout } from './PageLayout';

export const Support: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <PageLayout title="Enterprise Support" icon={Shield} onBack={onBack}>
            <section className="space-y-12 text-left">
                <div className="space-y-4">
                    <h2 className="text-2xl font-black tracking-tight">Dedicated Architecture Experts</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">For teams managing mission-critical infrastructure, we offer 24/7 dedicated support and training.</p>
                </div>

                <div className="grid gap-4 text-left">
                    {[
                        { icon: Lock, title: 'Compliance Guard', desc: 'Secure local instances for HIPPA and GDPR compliant data visualization.' },
                        { icon: MessageSquare, title: 'Architect Consultation', desc: 'One-on-one sessions with database engineers to optimize your specific schema.' },
                        { icon: Globe, title: 'SLA Guarantee', desc: '99.99% uptime for cloud-hosted visualization instances.' }
                    ].map((s, i) => (
                        <div key={i} className="flex items-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-default group text-left">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl mr-6 group-hover:scale-110 transition-transform">
                                <s.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white mb-1 tracking-wider text-left">{s.title}</h4>
                                <p className="text-[11px] font-medium text-slate-500 text-left">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PageLayout>
    );
};
