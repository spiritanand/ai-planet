"use client";

import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { useCallback } from "react";
import { Settings2 } from "lucide-react";
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

interface LLMNodeData {
  modelName: string;
  apiBase: string;
  apiKey: string;
  maxTokens: string;
  temperature: string;
  onChange?: (key: string, value: string) => void;
}

interface LLMNodeProps<T> {
  data: T;
  isConnectable?: boolean;
}

export function LLMNode({ data, isConnectable }: LLMNodeProps<LLMNodeData>) {
  const handleInputChange = useCallback(
    (key: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      data.onChange?.(key, evt.target.value);
    },
    [data],
  );

  const handleSelectChange = useCallback(
    (value: string) => {
      data.onChange?.("modelName", value);
    },
    [data],
  );

  return (
    <Card className="min-w-[320px] border bg-background shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <Settings2 className="h-4 w-4" />
        <div className="flex flex-1 items-center justify-between">
          <CardTitle className="text-sm font-medium">LLM ENGINE</CardTitle>
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="mb-3 rounded-lg bg-muted/50 p-2 text-sm">
          Lorem ipsum sic dolar amet
        </CardDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model Name</label>
            <Select value={data.modelName} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5">gpt-3.5</SelectItem>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
                <SelectItem value="claude-3">claude-3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Base</label>
            <Input
              placeholder="type something"
              value={data.apiBase}
              onChange={handleInputChange("apiBase")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI Key</label>
            <Input
              type="password"
              placeholder="type something"
              value={data.apiKey}
              onChange={handleInputChange("apiKey")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Tokens</label>
            <Input
              placeholder="type something"
              value={data.maxTokens}
              onChange={handleInputChange("maxTokens")}
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
              value={data.temperature}
              onChange={handleInputChange("temperature")}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Handle
              type="target"
              position={Position.Left}
              isConnectable={isConnectable}
              className="h-3 w-3"
            />
            <span className="text-xs">Input</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs">Output</span>
            <Handle
              type="source"
              position={Position.Right}
              isConnectable={isConnectable}
              className="h-3 w-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
