'use client';

import { useState } from 'react';
import { Database, LogOut, Plus, X, Trash2, Layout, Zap, Code } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '@/components/Sidebar';
import { Upload } from '@/components/Upload';
import { ERDiagram } from '@/components/ERDiagram';
import { ReactFlowProvider, type Node, type Edge } from 'reactflow';

// Import separate pages
import { SQLOptimizer } from '@/components/knowledge-base/SQLOptimizer';
import { DBDesigner } from '@/components/knowledge-base/DBDesigner';
import { DDLReconstructor } from '@/components/knowledge-base/DDLReconstructor';
import { Documentation } from '@/components/knowledge-base/Documentation';
import { APIRef } from '@/components/knowledge-base/APIRef';
import { Support } from '@/components/knowledge-base/Support';

// Sub-pages for the footer links
type Page = 'landing' | 'sql-optimizer' | 'db-designer' | 'ddl-reconstructor' | 'docs' | 'api' | 'support';

export default function Home() {
  const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [queryColumns, setQueryColumns] = useState<{ table: string, column: string }[]>([]);
  const [showFactory, setShowFactory] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [history, setHistory] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('db_viz_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleUploadSuccess = (response: any) => {
    setData({
      nodes: response.nodes,
      edges: response.edges
    });
    setStats(response.stats);
    setSelectedTable(null);
    setQueryColumns([]);
    setCurrentPage('landing');
    toast.success('Schema uploaded successfully!');
  };

  const handleManualTableAdd = (newTable: any) => {
    const newNode = {
      id: newTable.name,
      type: 'tableNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: newTable.name,
        columns: newTable.columns,
        group: 'custom',
        sql: `CREATE TABLE ${newTable.name} (\n${newTable.columns.map((c: any) => `  ${c.name} ${c.type}${c.isPk ? ' PRIMARY KEY' : ''}`).join(',\n')}\n);`
      }
    };

    if (!data) {
      setData({ nodes: [newNode as Node], edges: [] });
    } else {
      setData({
        ...data,
        nodes: [...data.nodes, newNode as Node]
      });
    }
    setShowFactory(false);
    toast.success(`Table "${newTable.name}" created!`);
  };

  const loadFromHistory = (entry: any) => {
    setData({ nodes: entry.data, edges: entry.edges });
    setStats(entry.stats);
    setSelectedTable(null);
    setQueryColumns([]);
    setCurrentPage('landing');
  };

  const handleColumnClick = (table: string, column: string) => {
    setQueryColumns(prev => {
      const exists = prev.find(q => q.table === table && q.column === column);
      if (exists) return prev.filter(q => !(q.table === table && q.column === column));
      return [...prev, { table, column }];
    });
  };

  const renderContent = () => {
    if (data) {
      return (
        <>
          <Sidebar
            nodes={data.nodes}
            edges={data.edges}
            onTableClick={(id) => setSelectedTable(id)}
            selectedTable={selectedTable}
            stats={stats}
            history={history}
            onLoadHistory={loadFromHistory}
          />
          <div className="flex-1 relative">
            <ReactFlowProvider>
              <ERDiagram
                initialNodes={data.nodes}
                initialEdges={data.edges}
                onSelectTable={(id) => setSelectedTable(id)}
                selectedTable={selectedTable}
                queryColumns={queryColumns}
                onColumnClick={handleColumnClick}
              />
            </ReactFlowProvider>
          </div>
        </>
      );
    }

    switch (currentPage) {
      case 'sql-optimizer': return <SQLOptimizer onBack={() => setCurrentPage('landing')} />;
      case 'db-designer': return <DBDesigner onBack={() => setCurrentPage('landing')} />;
      case 'ddl-reconstructor': return <DDLReconstructor onBack={() => setCurrentPage('landing')} />;
      case 'docs': return <Documentation onBack={() => setCurrentPage('landing')} />;
      case 'api': return <APIRef onBack={() => setCurrentPage('landing')} />;
      case 'support': return <Support onBack={() => setCurrentPage('landing')} />;
      default: return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-linear-to-b from-blue-50/20 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-slate-900 dark:to-slate-900 overflow-y-auto w-full">
          <div className="text-center max-w-2xl animate-in zoom-in-95 duration-500 mb-20">
            <div className="mb-6 inline-block p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 mx-auto">
              <Database className="w-12 h-12 text-blue-600 animate-pulse" />
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tight">
              Architect your <span className="text-blue-600">Database Schema.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
              Visual SQL diagramming for the modern engineer. Generate <strong>ER diagrams</strong> from SQL DDL, detect <strong>foreign key relationships</strong>, and architect <strong>enterprise database models</strong> with ease.
            </p>
            <Upload onUploadSuccess={handleUploadSuccess} />

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-10">
              <div className="cursor-pointer group hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-200" onClick={() => setCurrentPage('db-designer')}>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Layout className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">ER Diagramming</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-bold">Instantly transform complex SQL into interactive entity-relationship diagrams for documentation and planning.</p>
              </div>
              <div className="cursor-pointer group hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-200" onClick={() => setCurrentPage('sql-optimizer')}>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                  < Zap className="w-4 h-4 text-slate-900 dark:text-white" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">Schema Analysis</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-bold">Deep-dive into table relationships and primary key structures with our enterprise-grade heuristic engine.</p>
              </div>
              <div className="cursor-pointer group hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl transition-all border border-transparent hover:border-slate-200" onClick={() => setCurrentPage('ddl-reconstructor')}>
                <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Code className="w-4 h-4 text-slate-900 dark:text-white" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-2">SQL Generation</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-bold">Design tables visually and export ready-to-run SQL DDL queries for any relational database system.</p>
              </div>
            </div>
          </div>
          <Footer onNavigate={setCurrentPage} />
        </div>
      );
    }
  };

  return (
    <div className={`w-full max-w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans ${data ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <header className="flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 shadow-sm text-[10px] font-black tracking-widest uppercase sticky top-0">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setData(null); setCurrentPage('landing'); }}>
          <div className="bg-linear-to-br from-blue-500 to-indigo-700 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent normal-case">
              DB Visualizer <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded ml-2 uppercase font-black">Enterprise</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">High-Performance DDL Architect</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFactory(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
            >
            <Plus className="w-3 h-3" />
            <span>Create Table</span>
          </button>
          {data && (
            <button
              onClick={() => setData(null)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-100 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Eject</span>
            </button>
          )}
        </div>
      </header>

      <main className={`flex-1 flex relative ${data ? 'overflow-hidden' : ''}`}>
        {renderContent()}
      </main>

      {showFactory && (
        <TableFactory
          onClose={() => setShowFactory(false)}
          onSave={handleManualTableAdd}
        />
      )}
    </div>
  );
}

// Support Components
function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 py-10 px-6 border-t border-slate-100 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="space-y-4 max-w-sm text-left">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-black uppercase tracking-tight">DB Visualizer Enterprise</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            The world's leading interactive ER diagramming engine. Helping engineers visualize, optimize, and document complex database architectures globally.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-left">
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Solutions</h5>
            <ul className="space-y-2 text-left">
              <li><button onClick={() => onNavigate('sql-optimizer')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">SQL Optimizer</button></li>
              <li><button onClick={() => onNavigate('db-designer')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">Database Designer</button></li>
              <li><button onClick={() => onNavigate('ddl-reconstructor')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">DDL Reconstructor</button></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Resources</h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('docs')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">Documentation</button></li>
              <li><button onClick={() => onNavigate('api')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">API Reference</button></li>
              <li><button onClick={() => onNavigate('support')} className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">Enterprise Support</button></li>
            </ul>
          </div>
          <div className="hidden md:block space-y-3">
            <h5 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Company</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">Privacy Policy</a></li>
              <li><a href="#" className="text-[10px] text-slate-400 hover:text-blue-600 font-bold uppercase transition-colors text-left">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-left">
        <p className="text-[9px] font-black uppercase text-slate-300 text-left">© 2026 DB Visualizer Enterprise. All rights reserved.</p>
        <div className="flex space-x-4 ml-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">System Status: Optimal</span>
        </div>
      </div>
    </footer>
  );
}

function TableFactory({ onClose, onSave }: { onClose: () => void, onSave: (table: any) => void }) {
  const [name, setName] = useState('');
  const [columns, setColumns] = useState([{ name: 'id', type: 'INT', isPk: true }]);

  const addColumn = () => setColumns([...columns, { name: '', type: 'VARCHAR(255)', isPk: false }]);
  const removeColumn = (i: number) => setColumns(columns.filter((_, idx) => idx !== i));
  const updateColumn = (i: number, field: string, val: any) => {
    const next = [...columns];
    (next[i] as any)[field] = val;
    setColumns(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-left">Manual Table Architect</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6 text-left">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-slate-400 text-left">Table Identity</label>
            <input
              placeholder="e.g. users or order_items"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 font-bold outline-none ring-2 ring-transparent focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between text-left">
              <label className="text-[10px] font-black uppercase text-slate-400 text-left">Column Definitions</label>
              <button onClick={addColumn} className="text-[10px] font-black text-blue-600 flex items-center">
                <Plus className="w-3 h-3 mr-1" /> Add Column
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar text-left">
              {columns.map((col, i) => (
                <div key={i} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl group border border-transparent hover:border-slate-200 transition-all text-left">
                  <input
                    placeholder="Column Name"
                    className="bg-transparent font-bold text-xs flex-1 outline-none text-slate-900 dark:text-white"
                    value={col.name}
                    onChange={e => updateColumn(i, 'name', e.target.value)}
                  />
                  <select
                    className="bg-transparent font-mono text-[10px] uppercase font-black outline-none text-slate-600 dark:text-slate-400"
                    value={col.type}
                    onChange={e => updateColumn(i, 'type', e.target.value)}
                  >
                    <option>INT</option>
                    <option>BIGINT</option>
                    <option>VARCHAR(255)</option>
                    <option>TEXT</option>
                    <option>TIMESTAMP</option>
                    <option>BOOLEAN</option>
                  </select>
                  <button
                    onClick={() => updateColumn(i, 'isPk', !col.isPk)}
                    className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter transition-all ${col.isPk ? 'bg-yellow-400 text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                  >
                    PK
                  </button>
                  {columns.length > 1 && (
                    <button onClick={() => removeColumn(i)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end space-x-3 text-left">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
          <button
            disabled={!name}
            onClick={() => onSave({ name, columns })}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 disabled:opacity-50 active:scale-95 transition-all"
          >
            Materialize Table
          </button>
        </div>
      </div>
    </div>
  );
}
