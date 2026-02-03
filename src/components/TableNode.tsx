'use client';
import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

export function TableNode({ data, isConnectable, selected }: NodeProps) {
  const theme = data.theme || 'default';
  const group = data.group || 'other';

  const groupColors: Record<string, string> = {
    auth: '#ef4444',
    admin: '#a855f7',
    user: '#3b82f6',
    shop: '#10b981',
    order: '#f97316',
    billing: '#ec4899',
    other: '#94a3b8'
  };

  const themeStyles: Record<string, any> = {
    default: {
      header: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100',
      border: 'border-slate-200 dark:border-slate-700',
      selected: 'ring-2 ring-blue-500'
    },
    midnight: {
      header: 'bg-indigo-900 text-white',
      border: 'border-indigo-800',
      selected: 'ring-2 ring-purple-500'
    },
    mono: {
      header: 'bg-black text-white',
      border: 'border-black',
      selected: 'ring-2 ring-black'
    },
    forest: {
      header: 'bg-emerald-800 text-white',
      border: 'border-emerald-900',
      selected: 'ring-2 ring-emerald-400'
    }
  };

  const style = themeStyles[theme] || themeStyles.default;
  const isSelectedForQuery = (colName: string) => data.selectedColumns?.includes(colName);

  return (
    <div className={`bg-white dark:bg-slate-900 border ${style.border} rounded-xl shadow-2xl min-w-[220px] overflow-hidden transition-all duration-300 ${selected ? style.selected : ''} hover:scale-[1.02]`}>
      <div className="h-1 w-full" style={{ backgroundColor: groupColors[group] || groupColors.other }}></div>
      <div className={`${style.header} px-4 py-2.5 border-b ${style.border} font-black text-[11px] uppercase tracking-widest flex items-center justify-between`}>
        <span className="truncate">{data.label}</span>
        <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/40"></div>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {data.columns.map((col: any, idx: number) => (
          <div 
            key={idx} 
            onClick={() => data.onColumnClick?.(data.label, col.name)}
            className={`flex items-center justify-between text-[11px] p-1 rounded transition-colors cursor-pointer ${isSelectedForQuery(col.name) ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <div className="flex items-center space-x-2">
               {col.isPk && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>}
               {col.isFk && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
               <span className={`${col.isPk ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                 {col.name}
               </span>
            </div>
            <span className="text-slate-400 font-mono text-[9px] uppercase">{col.type}</span>
          </div>
        ))}
      </div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="opacity-0" />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="opacity-0" />
    </div>
  );
}

export default memo(TableNode);
