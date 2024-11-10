"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { InputNode } from "@/components/nodes/InputNode";
import { OutputNode } from "@/components/nodes/OutputNode";
import { LLMNode } from "@/components/nodes/LLMNode";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    position: { x: 100, y: 100 },
    data: {
      label: "Input Field",
      value: "",
      onChange: (value: string) => console.log("Input changed:", value),
    },
  },
  {
    id: "2",
    type: "llm",
    position: { x: 450, y: 100 },
    data: {
      modelName: "gpt-3.5",
      apiBase: "",
      apiKey: "",
      maxTokens: "",
      temperature: "0.5",
      onChange: (key: string, value: string) =>
        console.log(`LLM ${key} changed:`, value),
    },
  },
  {
    id: "3",
    type: "output",
    position: { x: 800, y: 100 },
    data: {
      label: "Output Field",
      value: "",
      onChange: (value: string) => console.log("Output changed:", value),
    },
  },
];

const initialEdges: Edge[] = [];

export default function Flow() {
  const nodeTypes = useMemo(
    () => ({
      input: InputNode,
      llm: LLMNode,
      output: OutputNode,
    }),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{ animated: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
