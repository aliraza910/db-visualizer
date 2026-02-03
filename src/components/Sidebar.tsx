'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Table as TableIcon, 
  ChevronRight, 
  BarChart3, 
  History as HistoryIcon, 
  Info,
  Code,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { type Node, type Edge } from 'reactflow';

interface SidebarProps {
  nodes: Node[];
  edges: Edge[];
  onTableClick: (tableName: string) => void;
  selectedTable: string | null;
  stats: any;
  history: any[];
  onLoadHistory: (entry: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  nodes, 
  edges,
  onTableClick, 
  selectedTable, 
  stats, 
  history, 
  onLoadHistory 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'tables' | 'insights' | 'history'>('tables');

  const filteredNodes = useMemo(() => nodes.filter(node => {
    const tableMatch = node.data.label.toLowerCase().includes(searchTerm.toLowerCase());
    const columnMatch = node.data.columns?.some((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return tableMatch || columnMatch;
  }), [nodes, searchTerm]);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedTable), [nodes, selectedTable]);

  const neighbors = useMemo(() => {
    if (!selectedTable) return new Set();
    const n = new Set<string>();
    n.add(selectedTable);
    edges.forEach(edge => {
      if (edge.source === selectedTable) n.add(edge.target);
      if (edge.target === selectedTable) n.add(edge.source);
    });
    return n;
  }, [selectedTable, edges]);

  return (
    <div className="w-80 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 overflow-hidden shadow-2xl font-sans text-slate-900 dark:text-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 p-1">
        {[
          { id: 'tables', icon: LayoutGrid, label: 'Registry' },
          { id: 'insights', icon: BarChart3, label: 'Insights' },
          { id: 'history', icon: HistoryIcon, label: 'History' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-1 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-all rounded-lg ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className="w-3 h-3" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'tables' && (
        <>
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Find tables, columns..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center">
                <span>Tables ({filteredNodes.length})</span>
                {selectedTable && (
                    <button 
                        onClick={() => onTableClick('')}
                        className="text-blue-500 hover:text-blue-600 lowercase font-bold tracking-normal"
                    >
                        clear focus
                    </button>
                )}
              </div>
              {filteredNodes.map(node => {
                const isSelected = selectedTable === node.id;
                const isNeighbor = neighbors.has(node.id);
                const isDull = selectedTable && !isSelected && !isNeighbor;

                return (
                  <button
                    key={node.id}
                    onClick={() => onTableClick(node.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left group border border-transparent ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-400 scale-[1.02] z-10' : isNeighbor ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'} ${isDull ? 'opacity-20 grayscale' : 'opacity-100 grayscale-0'}`}
                  >
                    <div className={`p-1.5 rounded-lg shadow-sm transition-all ${isSelected ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 border border-transparent group-hover:border-blue-100'}`}>
                      <TableIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'}`} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className={`text-sm font-bold truncate leading-tight ${isSelected ? 'text-white' : ''}`}>{node.data.label}</span>
                        {searchTerm && node.data.columns?.some((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase())) && (
                            <span className={`text-[9px] font-bold uppercase mt-0.5 ${isSelected ? 'text-blue-100' : 'text-blue-500'}`}>Matched</span>
                        )}
                    </div>
                    {!isDull && <ChevronRight className={`w-4 h-4 transition-all ${isSelected ? 'text-white' : 'text-slate-300 group-hover:translate-x-1'}`} />}
                  </button>
                );
              })}
            </div>

            {selectedTable && selectedNode && (
              <div className="fixed inset-y-0 left-80 w-[400px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-[20px_0_50px_rgba(0,0,0,0.1)] z-30 animate-in slide-in-from-left duration-300 flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm">
                    <button 
                      onClick={() => onTableClick('')}
                      className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 font-bold"
                    >
                        ✕
                    </button>
                    
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                            <TableIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">{selectedNode.data.label}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedNode.data.columns?.length || 0} columns • {neighbors.size - 1} connections</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Info className="w-3 h-3 mr-1.5" /> Schema Structure
                        </h4>
                        <div className="grid gap-2">
                            {selectedNode.data.columns?.map((col: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center space-x-3">
                                        {col.isPk && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>}
                                        {col.isFk && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                                        <span className="text-sm font-bold">{col.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase font-black">{col.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                                <Code className="w-3 h-3 mr-1.5" /> Generate SQL
                            </h4>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedNode.data.sql || '');
                                    alert('Copied DDL to clipboard');
                                }}
                                className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
                            >
                                Copy DDL
                            </button>
                        </div>
                        <div className="relative">
                            <pre className="bg-slate-900 text-blue-400 p-5 rounded-2xl text-[11px] font-mono overflow-x-auto shadow-2xl border border-slate-800 leading-relaxed custom-scrollbar max-h-[300px]">
                                {selectedNode.data.sql || `-- DDL for ${selectedNode.data.label} not found`}
                            </pre>
                            <div className="absolute top-0 right-0 w-8 h-full bg-linear-to-l from-slate-900 pointer-events-none rounded-r-2xl"></div>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'insights' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {!stats ? (
            <div className="text-center py-20 opacity-30 uppercase font-black tracking-widest text-[10px]">
                No Insight Data Available
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">Schema Health</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Tables</div>
                    <div className="text-3xl font-black tracking-tight">{stats.tableCount || 0}</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Relationships</div>
                    <div className="text-3xl font-black tracking-tight text-blue-600">{stats.relationshipCount || 0}</div>
                  </div>
                </div>
                
                {stats.potentialIssues && stats.potentialIssues.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Optimization Alerts</h4>
                        {stats.potentialIssues.map((issue: any, i: number) => (
                            <div key={i} className={`p-3 rounded-xl border text-xs font-bold flex items-start space-x-3 ${issue.type === 'warning' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-600'}`}>
                                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${issue.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                <span>{issue.message}</span>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              {stats.groups && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Module Distribution</h3>
                    <div className="flex flex-wrap gap-2">
                        {stats.groups.map((group: any, i: number) => (
                            <div key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                {group.name} <span className="ml-1.5 opacity-40">{group.count}</span>
                            </div>
                        ))}
                    </div>
                  </div>
              )}

              {stats.mostConnectedTables && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Hotspots</h3>
                    <div className="space-y-2">
                      {stats.mostConnectedTables.map((t: any, i: number) => (
                        <button 
                          key={i} 
                          onClick={() => onTableClick(t.name)}
                          className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all group text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-black text-slate-300 group-hover:text-blue-500">#{i+1}</span>
                            <span className="text-sm font-bold truncate max-w-[120px]">{t.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg uppercase tracking-tight">{t.connections} links</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 animate-in fade-in zoom-in-95 duration-300">
           <div className="px-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex justify-between items-center">
              <span>Recents</span>
              {history.length > 0 && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('db_viz_history');
                    window.location.reload();
                  }}
                  className="text-[9px] text-red-500 hover:text-red-600 font-bold lowercase"
                >
                  clear history
                </button>
              )}
              <span className="h-px bg-slate-100 dark:bg-slate-800 flex-1 ml-4 text-right"></span>
           </div>
           {history.length === 0 ? (
             <div className="text-center py-20">
                <Clock className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No History Yet</p>
             </div>
           ) : (
             <div className="space-y-3">
                {history.map((entry) => (
                    <button 
                        key={entry.id}
                        onClick={() => onLoadHistory(entry)}
                        className="w-full flex flex-col p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left group"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black truncate pr-4">{entry.name}</span>
                            <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">Loaded</span>
                        </div>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-bold">
                            <span className="flex items-center"><TableIcon className="w-2.5 h-2.5 mr-1" /> {entry.data?.length || 0} tables</span>
                            <span className="flex items-center">🔗 {entry.stats?.relationshipCount || 0} links</span>
                        </div>
                    </button>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};
