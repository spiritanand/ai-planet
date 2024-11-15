"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { FileOutput } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useStore from "@/lib/store";
import { Textarea } from "../ui/textarea";

export function OutputNode() {
  const { outputNode } = useStore((state) => state);

  if (!outputNode) return null;

  return (
    <Card
      className={cn(
        "min-w-[320px] border bg-background shadow-md",
        outputNode.data.status === "error" && "border-red-500",
        outputNode.data.status === "success" && "border-green-500",
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        <FileOutput className="h-4 w-4" />
        <div className="flex flex-1 items-center justify-between">
          <CardTitle className="text-sm font-medium">OUTPUT</CardTitle>
          <div
            className={cn(
              "h-2 w-2 rounded-full bg-gray-500",
              outputNode.data.status === "success" && "bg-green-500",
              outputNode.data.status === "error" && "bg-red-500",
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <CardDescription className="mb-3 rounded-lg bg-muted/50 p-2 text-sm">
          Output generated by LLM
        </CardDescription>

        <div className="space-y-2">
          <label className="text-sm font-medium">Output Response</label>
          <Textarea
            placeholder="Output Response will be shown here"
            value={outputNode.data.value}
            readOnly
            className={cn(
              "min-h-[300px] bg-muted/50",
              "cursor-default",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Handle
            type="target"
            position={Position.Left}
            isConnectable
            className="h-3 w-3"
          />
          <span className="text-xs">LLM Engine</span>
        </div>
      </CardContent>
    </Card>
  );
}
