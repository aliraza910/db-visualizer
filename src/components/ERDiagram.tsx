'use client';
import { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  type Node, 
  type Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  useReactFlow,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import TableNode from './TableNode';
import { getLayoutedElements } from '../utils/layout';
import { Layout, Download, Maximize, Code } from 'lucide-react';
import { toPng } from 'html-to-image';
// @ts-ignore
import download from 'downloadjs';

interface ERDiagramProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onSelectTable: (tableName: string) => void;
  selectedTable: string | null;
  queryColumns: {table: string, column: string}[];
  onColumnClick: (table: string, column: string) => void;
}

export const ERDiagram: React.FC<ERDiagramProps> = ({ 
  initialNodes, 
  initialEdges, 
  onSelectTable,
  selectedTable,
  queryColumns,
  onColumnClick
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layoutDirection, setLayoutDirection] = useState('LR');
  const [theme, setTheme] = useState('default');
  const [queryMode, setQueryMode] = useState(false);
  const { fitView } = useReactFlow();

  // 1. Initial Layout Effect - Only runs when the source data changes
  useEffect(() => {
    if (initialNodes.length > 0) {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, layoutDirection);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
        setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 200);
    }
  }, [initialNodes, initialEdges, layoutDirection, setNodes, setEdges, fitView]);

  // 2. Viewport Focus Effect
  useEffect(() => {
    if (selectedTable) {
        fitView({ nodes: [{ id: selectedTable }], duration: 800, padding: 1.5 });
    }
  }, [selectedTable, fitView]);

  // 3. Stylization Memo - Calculate visual state without triggering effects
  // This is better than setNodes/setEdges in a loop
  const styledNodes = useMemo(() => {
    // Find neighbors for dimming
    const neighbors = new Set<string>();
    if (selectedTable) {
        neighbors.add(selectedTable);
        edges.forEach(e => {
            if (e.source === selectedTable) neighbors.add(e.target);
            if (e.target === selectedTable) neighbors.add(e.source);
        });
    }

    return nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        theme,
        onColumnClick,
        selectedColumns: queryColumns.filter(q => q.table === n.id).map(q => q.column)
      },
      style: {
        ...n.style,
        opacity: selectedTable ? (neighbors.has(n.id) ? 1 : 0.2) : 1,
        transition: 'opacity 0.3s ease'
      }
    }));
  }, [nodes, edges, selectedTable, theme, queryColumns, onColumnClick]);

  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const isConnected = selectedTable && (edge.source === selectedTable || edge.target === selectedTable);
      const themeColor = theme === 'midnight' ? '#a855f7' : theme === 'forest' ? '#10b981' : '#3b82f6';
      return {
        ...edge,
        animated: !!isConnected,
        style: { 
          ...edge.style, 
          stroke: isConnected ? themeColor : (theme === 'mono' ? '#000' : '#cbd5e1'),
          strokeWidth: isConnected ? 3 : 1,
          opacity: selectedTable ? (isConnected ? 1 : 0.1) : 1
        },
      };
    });
  }, [edges, selectedTable, theme]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    onSelectTable(node.id === selectedTable ? '' : node.id);
  }, [onSelectTable, selectedTable]);

  const toggleLayout = () => {
    setLayoutDirection((prev: string) => prev === 'LR' ? 'TB' : 'LR');
  };

  const onExport = () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) return;

    toPng(element, {
      backgroundColor: theme === 'midnight' ? '#0f172a' : theme === 'mono' ? '#ffffff' : '#f8fafc',
      style: { transform: 'scale(1)' },
      width: element.offsetWidth * 2,
      height: element.offsetHeight * 2,
    }).then((dataUrl) => {
      download(dataUrl, `database-schema-${theme}.png`);
    });
  };

  const generatedQuery = useMemo(() => {
    if (queryColumns.length === 0) return '';
    const tables = Array.from(new Set(queryColumns.map(q => q.table)));
    const select = queryColumns.map(q => `  ${q.table}.${q.column}`).join(',\n');
    const from = tables.join(', ');
    return `SELECT \n${select} \nFROM ${from};`;
  }, [queryColumns]);

  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
      >
        <Background 
          gap={20} 
          size={1} 
          color={theme === 'midnight' ? '#1e293b' : theme === 'forest' ? '#ecfdf5' : '#e2e8f0'} 
        />
        <Controls showInteractive={false} position="bottom-right" />
        <MiniMap 
            nodeColor={theme === 'midnight' ? '#a855f7' : '#3b82f6'}
            className="rounded-xl border border-slate-200 shadow-2xl bg-white/50! backdrop-blur-md"
        />

        {queryMode && queryColumns.length > 0 && (
            <Panel position="bottom-left" className="m-4 max-w-md animate-in slide-in-from-bottom duration-500">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Query Builder</span>
                        <button onClick={() => setQueryMode(false)} className="text-slate-500 hover:text-white transition-colors text-xs">×</button>
                    </div>
                    <pre className="p-4 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre">
                        {generatedQuery}
                    </pre>
                    <div className="px-4 py-2 bg-slate-800/50 flex justify-end">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(generatedQuery);
                                toast.success('SQL Query copied to clipboard!');
                            }}
                            className="text-[9px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all uppercase"
                        >
                            Copy SQL
                        </button>
                    </div>
                </div>
            </Panel>
        )}

        <Panel position="top-right" className="flex items-center space-x-3 bg-white/80 dark:bg-slate-900/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['default', 'midnight', 'mono', 'forest'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`w-6 h-6 rounded-lg transition-all ${theme === t ? 'ring-2 ring-blue-500 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                        style={{ background: t === 'default' ? '#3b82f6' : t === 'midnight' ? '#312e81' : t === 'mono' ? '#000' : '#065f46' }}
                    />
                ))}
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            <button
                onClick={() => setQueryMode(!queryMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] ${queryMode ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
                <Code className="w-4 h-4" />
                <span>Builder</span>
            </button>

            <button
                onClick={toggleLayout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-600 dark:text-slate-300 group"
            >
                <Layout className={`w-4 h-4 transition-transform duration-500 ${layoutDirection === 'TB' ? 'rotate-90' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{layoutDirection}</span>
            </button>
            <button
                onClick={onExport}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-widest">Export</span>
            </button>
            <button
                onClick={() => fitView({ duration: 800 })}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-all active:rotate-45"
            >
                <Maximize className="w-4 h-4" />
            </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
