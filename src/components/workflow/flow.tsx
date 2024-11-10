"use client";

import { useMemo } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";

import { InputNode } from "@/components/nodes/InputNode";
import { OutputNode } from "@/components/nodes/OutputNode";
import { LLMNode } from "@/components/nodes/LLMNode";
import useStore from "@/lib/store";

export default function Flow() {
  const nodeTypes = useMemo(
    () => ({
      input: InputNode,
      llm: LLMNode,
      output: OutputNode,
    }),
    [],
  );

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    (state) => state,
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full">
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
