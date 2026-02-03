// @ts-ignore
import dagre from 'dagre';
import { type Node, type Edge, Position } from 'reactflow';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 250;

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  
  // Use a fresh graph for each layout call to avoid accumulated state
  const g = new dagre.graphlib.Graph();
  g.setGraph({ 
    rankdir: direction,
    nodesep: 100, // Increased spacing between nodes in the same rank
    ranksep: 150, // Increased spacing between ranks
    marginx: 50,
    marginy: 50
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    // Estimate height based on number of columns to prevent overlap
    const estimatedHeight = Math.max(150, (node.data.columns?.length || 0) * 30 + 60);
    g.setNode(node.id, { width: nodeWidth, height: estimatedHeight });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    } as Node;
  });

  return { nodes: newNodes, edges };
};
