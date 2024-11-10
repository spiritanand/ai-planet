"use client";

import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileInput } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useStore from "@/lib/store";

export function InputNode() {
  const { updateInputNodeValue, inputNode } = useStore((state) => state);

  return (
    <Card className="min-w-[320px] border bg-background shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <FileInput className="h-4 w-4" />
        <div className="flex flex-1 items-center justify-between">
          <CardTitle className="text-sm font-medium">INPUT</CardTitle>
          <div className="h-2 w-2 rounded-full bg-gray-300" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="mb-3 rounded-lg bg-muted/50 p-2 text-sm">
          Write the input/ question you want to ask
        </CardDescription>

        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <Input
            placeholder="Type Something..."
            value={inputNode.data.value}
            onChange={(e) => updateInputNodeValue(inputNode.id, e.target.value)}
            className={cn(
              "transition-all",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          />
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 text-sm text-muted-foreground">
          <Handle
            type="source"
            position={Position.Right}
            isConnectable
            className="h-3 w-3"
          />
          <span className="text-xs">LLM Engine</span>
        </div>
      </CardContent>
    </Card>
  );
}
