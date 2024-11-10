"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { DROPPABLE } from "@/lib/constants";
import useStore from "@/lib/store";
import { nanoid } from "nanoid";
import { useId } from "react";
import { Toaster } from "sonner";

function Providers({ children }: { children: React.ReactNode }) {
  // Provide a unique id for the DndContext
  const dndId = useId();

  const { addInputNode, addOutputNode, addLLMNode } = useStore(
    (state) => state,
  );

  // If the drag ends over the droppable area, add a new node
  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;

    if (!over || active.id === over.id) return;

    if (over.id === DROPPABLE) {
      const baseNode = {
        id: nanoid(),
        type: active.id as string,
        position: {
          x: delta.x,
          y: delta.y,
        },
      };

      if (active.id === "input") {
        addInputNode({
          ...baseNode,
          data: {
            value: "",
            status: "default",
          },
        });
      } else if (active.id === "output") {
        addOutputNode({
          ...baseNode,
          data: {
            value: "",
            status: "default",
          },
        });
      } else {
        addLLMNode({
          ...baseNode,
          data: {
            apiBase: "https://api.openai.com/v1",
            apiKey: "",
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            maxTokens: 2000,
            status: "default",
          },
        });
      }
    }
  }

  return (
    <DndContext id={dndId} onDragEnd={handleDragEnd}>
      <Toaster richColors position="top-center" />
      {children}
    </DndContext>
  );
}

export default Providers;
