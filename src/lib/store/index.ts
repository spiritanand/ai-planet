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
import { toast } from "sonner";
import { createWithEqualityFn } from "zustand/traditional";

interface InputNode extends Node {
  data: {
    value: string;
    status: "default" | "success" | "error";
  };
}

interface OutputNode extends Node {
  data: {
    value: string;
    status: "default" | "success" | "error";
  };
}

interface LLMNode extends Node {
  data: {
    model: string;
    temperature: number;
    maxTokens: number;
    apiBase: string;
    apiKey: string;
    status: "default" | "success" | "error";
  };
}

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: (edges: Edge[]) => void;
  inputNode: InputNode | null;
  addInputNode: (node: InputNode) => void;
  updateInputNodeValue: (nodeId: string, value: string) => void;
  outputNode: OutputNode | null;
  addOutputNode: (node: OutputNode) => void;
  updateOutputNodeValue: (nodeId: string, value: string) => void;
  llmNode: LLMNode | null;
  addLLMNode: (node: LLMNode) => void;
  updateLLMNode: (nodeId: string, value: LLMNode["data"]) => void;
  isValidFlow: () => boolean;
};

// Store to manage the state of the flow
const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [] as Node[],
  edges: [] as Edge[],
  inputNode: {} as InputNode,
  outputNode: {} as OutputNode,
  llmNode: {} as LLMNode,
  onNodesChange: (changes: NodeChange[]) => {
    // Handle node removals
    const nodeRemovals = changes.filter(
      (change): change is NodeChange & { type: "remove" } =>
        change.type === "remove",
    );

    set((state) => {
      const newState: Partial<RFState> = {
        nodes: applyNodeChanges(changes, state.nodes),
      };

      // Reset corresponding state when a node is removed
      nodeRemovals.forEach((removal) => {
        if (removal.id === state.inputNode?.id) {
          newState.inputNode = null;
        }
        if (removal.id === state.outputNode?.id) {
          newState.outputNode = null;
        }
        if (removal.id === state.llmNode?.id) {
          newState.llmNode = null;
        }
      });

      return newState;
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

    const { inputNode, llmNode, outputNode } = get();

    // Only allow:
    // 1. Input -> LLM
    // 2. LLM -> Output
    const isValidConnection =
      // Input -> LLM connection
      (connection.source === inputNode?.id &&
        connection.target === llmNode?.id) ||
      // LLM -> Output connection
      (connection.source === llmNode?.id &&
        connection.target === outputNode?.id);

    if (!isValidConnection) {
      toast.error("Invalid connection");
      return;
    }

    set(() => ({
      edges: addEdge(connection, get().edges),
    }));
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
  updateInputNodeValue: (
    nodeId: string,
    value: string,
    status: "default" | "success" | "error" = "default",
  ) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { value } } : node,
      ),
      inputNode:
        nodeId === state.inputNode?.id
          ? { ...state.inputNode, data: { value, status } }
          : state.inputNode,
    }));
  },
  addOutputNode: (node: Node) => {
    set(({ nodes }) => ({
      nodes: [...nodes, node],
      outputNode: node as OutputNode,
    }));
  },
  updateOutputNodeValue: (
    nodeId: string,
    value: string,
    status: "default" | "success" | "error" = "default",
  ) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { value } } : node,
      ),
      outputNode:
        nodeId === state.outputNode?.id
          ? { ...state.outputNode, data: { value, status } }
          : state.outputNode,
    }));
  },
  addLLMNode: (node: Node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      llmNode: node as LLMNode,
    }));
  },
  updateLLMNode: (nodeId: string, value: LLMNode["data"]) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: value } : node,
      ),
      llmNode:
        nodeId === state.llmNode?.id
          ? { ...state.llmNode, data: value }
          : state.llmNode,
    }));
  },
  isValidFlow: () => {
    const { inputNode, outputNode, llmNode, edges } = get();

    // Check if all required nodes are present
    if (!inputNode || !outputNode || !llmNode) return false;

    // Check if all edges are connected
    if (edges.length === 0) return false;

    // Check if there is a path from input to output
    const inputNodeId = inputNode.id;
    const llmNodeId = llmNode.id;
    const outputNodeId = outputNode.id;

    const hasInputToLLMPath = edges.some(
      (edge) => edge.source === inputNodeId && edge.target === llmNodeId,
    );

    const hasLLMToOutputPath = edges.some(
      (edge) => edge.source === llmNodeId && edge.target === outputNodeId,
    );

    const isConnectionsValid = hasInputToLLMPath && hasLLMToOutputPath;

    return isConnectionsValid;
  },
}));

export default useStore;
