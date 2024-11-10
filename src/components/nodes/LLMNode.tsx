"use client";

import { Handle, Position } from "@xyflow/react";
import { Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/lib/store";
import { Input } from "../ui/input";

export function LLMNode() {
  const { updateLLMNode, llmNode } = useStore((state) => state);

  console.log({ llmNode });

  return (
    <Card className="min-w-[320px] border bg-background shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <Brain className="h-4 w-4" />
        <div className="flex flex-1 items-center justify-between">
          <CardTitle className="text-sm font-medium">LLM ENGINE</CardTitle>
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="mb-3 rounded-lg bg-muted/50 p-2 text-sm">
          Configure the LLM engine
        </CardDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model Name</label>
            <Select
              value={llmNode.data.model}
              onValueChange={(value) =>
                updateLLMNode(llmNode.id, {
                  ...llmNode.data,
                  model: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5">gpt-3.5</SelectItem>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Base</label>
            <Input
              placeholder="type something"
              value={llmNode.data.apiBase}
              onChange={(e) =>
                updateLLMNode(llmNode.id, {
                  ...llmNode.data,
                  apiBase: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI Key</label>
            <Input
              type="password"
              placeholder="type something"
              value={llmNode.data.apiKey}
              onChange={(e) =>
                updateLLMNode(llmNode.id, {
                  ...llmNode.data,
                  apiKey: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Tokens</label>
            <Input
              type="number"
              placeholder="type something"
              min="1"
              max="10000"
              step="10"
              value={llmNode.data.maxTokens}
              onChange={(e) =>
                updateLLMNode(llmNode.id, {
                  ...llmNode.data,
                  maxTokens: e.target.value ? parseInt(e.target.value) : 0,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.1"
              placeholder="0.5"
              value={llmNode.data.temperature}
              onChange={(e) =>
                updateLLMNode(llmNode.id, {
                  ...llmNode.data,
                  temperature: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Handle
              type="target"
              position={Position.Left}
              isConnectable
              className="h-3 w-3"
            />
            <span className="text-xs">Input</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">Output</span>
            <Handle
              type="source"
              position={Position.Right}
              isConnectable
              className="h-3 w-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
