import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";

interface InputNode extends Node {
  data: {
    value: string;
  };
}

interface OutputNode extends Node {
  data: {
    value: string;
  };
}

interface LLMNode extends Node {
  data: {
    model: string;
    temperature: number;
    maxTokens: number;
    apiBase: string;
    apiKey: string;
  };
}

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: (edges: Edge[]) => void;
  inputNode: InputNode;
  addInputNode: (node: InputNode) => void;
  updateInputNodeValue: (nodeId: string, value: string) => void;
  outputNode: OutputNode;
  addOutputNode: (node: OutputNode) => void;
  updateOutputNodeValue: (nodeId: string, value: string) => void;
  llmNode: LLMNode;
  addLLMNode: (node: LLMNode) => void;
  updateLLMNode: (nodeId: string, value: LLMNode["data"]) => void;
};

// Store to manage the state of the flow
const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [] as Node[],
  edges: [] as Edge[],
  inputNode: {} as InputNode,
  outputNode: {} as OutputNode,
  llmNode: {} as LLMNode,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) return;

    if (
      get().edges.some(
        (edge) =>
          // Prevent new connection from same source
          edge.source === connection.source ||
          // Prevent reverse connections
          (edge.source === connection.target &&
            edge.target === connection.source),
      )
    )
      return;

    set(() => {
      return {
        edges: addEdge(connection, get().edges),
      };
    });
  },
  addNode: (node: Node) => {
    set(({ nodes }) => ({ nodes: [...nodes, node] }));
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  addInputNode: (node: Node) => {
    set(({ nodes }) => ({
      nodes: [...nodes, node],
      inputNode: node as InputNode,
    }));
  },
  updateInputNodeValue: (nodeId: string, value: string) => {
    set(({ nodes }) => ({
      nodes: nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { value } } : node,
      ),
      inputNode:
        nodeId === get().inputNode.id
          ? { ...get().inputNode, data: { value } }
          : get().inputNode,
    }));
  },
  addOutputNode: (node: Node) => {
    set(({ nodes }) => ({
      nodes: [...nodes, node],
      outputNode: node as OutputNode,
    }));
  },
  updateOutputNodeValue: (nodeId: string, value: string) => {
    set(({ nodes }) => ({
      nodes: nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { value } } : node,
      ),
      outputNode:
        nodeId === get().outputNode.id
          ? { ...get().outputNode, data: { value } }
          : get().outputNode,
    }));
  },
  addLLMNode: (node: Node) => {
    set(({ nodes }) => ({
      nodes: [...nodes, node],
      llmNode: node as LLMNode,
    }));
  },
  updateLLMNode: (nodeId: string, value: LLMNode["data"]) => {
    set(({ nodes }) => ({
      nodes: nodes.map((node) =>
        node.id === nodeId ? { ...node, data: value } : node,
      ),
      llmNode:
        nodeId === get().llmNode.id
          ? { ...get().llmNode, data: value }
          : get().llmNode,
    }));
  },
}));

export default useStore;
