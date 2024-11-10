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
          // Ensure the node is dropped within the window
          x: Math.max(window.innerWidth + delta.x, 0),
          y: Math.max(delta.y + 15, 0),
        },
      };

      if (active.id === "input") {
        addInputNode({
          ...baseNode,
          data: {
            value: "",
          },
        });
      } else if (active.id === "output") {
        addOutputNode({
          ...baseNode,
          data: {
            value: "",
          },
        });
      } else {
        addLLMNode({
          ...baseNode,
          data: {
            apiBase: "",
            apiKey: "",
            model: "",
            temperature: 0,
            maxTokens: 0,
          },
        });
      }
    }
  }

  return (
    <DndContext id={dndId} onDragEnd={handleDragEnd}>
      <Toaster richColors position="top-right" />
      {children}
    </DndContext>
  );
}

export default Providers;
