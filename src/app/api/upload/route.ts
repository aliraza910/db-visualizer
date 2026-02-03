import { NextRequest, NextResponse } from 'next/server';
import { Parser } from 'node-sql-parser';

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const sqlContent = await file.text();
    let ast;
    try {
      ast = parser.astify(sqlContent, { database: 'MySQL' });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse SQL' }, { status: 400 });
    }

    if (!Array.isArray(ast)) ast = [ast];

    const tables: any[] = [];
    const relationships: any[] = [];

    ast.forEach((statement: any) => {
      if (statement.type === 'create' && statement.keyword === 'table') {
        const tableName = statement.table[0].table;
        const columns: any[] = [];

        statement.create_definitions.forEach((def: any) => {
          if (def.resource === 'column') {
            columns.push({
              name: def.column.column,
              type: def.definition.dataType,
              isPk: !!(def.definition.suffix && def.definition.suffix.some((s: string) => s.toLowerCase() === 'primary key')),
              isFk: false
            });
          } else if (def.resource === 'constraint') {
             if (def.constraint_type === 'primary key') {
                 def.definition.forEach((col: any) => {
                     columns.forEach(c => { if (c.name === col.column) c.isPk = true; });
                 });
             } else if (def.constraint_type === 'foreign key') {
                 const fkCol = def.definition[0].column;
                 const refTable = def.reference_definition.table[0].table;
                 const refCol = def.reference_definition.definition[0].column;
                 columns.forEach(c => { if (c.name === fkCol) c.isFk = true; });
                 relationships.push({ source: tableName, target: refTable, sourceHandle: fkCol, targetHandle: refCol, type: 'standard' });
             }
          } else if (def.resource === 'foreign key') {
              const fkCol = def.definition[0].column;
              const refTable = def.reference_definition.table[0].table;
              const refCol = def.reference_definition.definition[0].column;
              columns.forEach(c => { if (c.name === fkCol) c.isFk = true; });
              relationships.push({ source: tableName, target: refTable, sourceHandle: fkCol, targetHandle: refCol, type: 'standard' });
          }
        });

        tables.push({ name: tableName, columns });
      }
    });

    // Auto-detect PK/FK relationships
    const pkMap = new Map();
    tables.forEach(t => {
      const pk = t.columns.find((c: any) => c.isPk);
      if (pk) pkMap.set(t.name.toLowerCase(), { name: pk.name, originalName: pk.name });
    });

    tables.forEach(table => {
      const tablePk = table.columns.find((c: any) => c.isPk);
      table.columns.forEach((col: any) => {
        const colName = col.name.toLowerCase();
        pkMap.forEach((targetPk, targetName) => {
           if (targetName === table.name.toLowerCase()) return;
           const patterns = [`${targetName}_id`, `${targetName}id`, targetName];

           if (patterns.includes(colName)) {
              col.isFk = true;
              const exists = relationships.some(r => r.source === table.name && r.targetHandle === targetPk.originalName && r.sourceHandle === col.name);
              if (!exists) {
                const targetTable = tables.find(t => t.name.toLowerCase() === targetName);
                if (targetTable) {
                    relationships.push({ source: table.name, target: targetTable.name, sourceHandle: col.name, targetHandle: targetPk.originalName, type: 'standard' });
                }
              }
           }

           if (tablePk && tablePk.name.toLowerCase() === targetPk.name.toLowerCase() && tablePk.name.toLowerCase() !== 'id') {
              const exists = relationships.some(r => ((r.source === table.name && r.target === targetName) || (r.source === targetName && r.target === table.name)) && r.sourceHandle === tablePk.name);
              if (!exists) {
                const targetTable = tables.find(t => t.name.toLowerCase() === targetName);
                if (targetTable) {
                    relationships.push({ source: table.name, target: targetTable.name, sourceHandle: tablePk.name, targetHandle: targetPk.originalName, type: 'shared-pk' });
                }
              }
           }
        });
      });
    });

    const groups: any = {};
    tables.forEach(t => {
      const prefix = t.name.includes('_') ? t.name.split('_')[0] : 'other';
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(t.name);
    });

    const stats = {
        tableCount: tables.length,
        columnCount: tables.reduce((acc, t) => acc + t.columns.length, 0),
        relationshipCount: relationships.length,
        avgColumnsPerTable: tables.length ? (tables.reduce((acc, t) => acc + t.columns.length, 0) / tables.length).toFixed(1) : 0,
        mostConnectedTables: tables.map(t => ({ name: t.name, connections: relationships.filter(r => r.source === t.name || r.target === t.name).length })).sort((a,b) => b.connections - a.connections).slice(0,5),
        groups: Object.keys(groups).map(name => ({ name, count: groups[name].length })),
        potentialIssues: [] as any[]
    };

    tables.forEach(t => {
        if (!t.columns.some((c: any) => c.isPk)) stats.potentialIssues.push({ type: 'warning', message: `Table "${t.name}" has no Primary Key.` });
        if (t.columns.length > 20) stats.potentialIssues.push({ type: 'info', message: `Table "${t.name}" has over 20 columns.` });
    });

    const finalNodes = tables.map(table => {
      const prefix = table.name.includes('_') ? table.name.split('_')[0] : 'other';
      const sql = `CREATE TABLE ${table.name} (\n${table.columns.map((c: any) => `  ${c.name} ${c.type}${c.isPk ? ' PRIMARY KEY' : ''}${c.isFk ? ' /* FK */' : ''}`).join(',\n')}\n);`;
      return {
        id: table.name,
        type: 'tableNode',
        position: { x: 0, y: 0 },
        data: { 
          label: table.name, 
          columns: table.columns, 
          group: prefix, 
          sql: sql 
        }
      };
    });

    const finalEdges = relationships.map((rel, i) => ({
      id: `e${i}-${rel.source}-${rel.target}`,
      source: rel.source,
      target: rel.target,
      label: rel.type === 'shared-pk' ? 'Shared PK' : `${rel.sourceHandle} -> ${rel.targetHandle}`,
      type: 'smoothstep',
      animated: rel.type === 'shared-pk',
      style: { stroke: rel.type === 'shared-pk' ? '#eab308' : '#cbd5e1', strokeWidth: rel.type === 'shared-pk' ? 2 : 1, strokeDasharray: rel.type === 'shared-pk' ? '5,5' : 'none' },
      data: { type: rel.type }
    }));

    return NextResponse.json({ tables, nodes: finalNodes, edges: finalEdges, stats, groups: stats.groups, version: "2.1.0-ENTERPRISE-NEXT" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
