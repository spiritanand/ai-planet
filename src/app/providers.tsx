"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { DROPPABLE } from "@/lib/constants";
import useStore from "@/lib/store";
import { nanoid } from "nanoid";
import { useId } from "react";
// import { Toaster } from "react-hot-toast";

function Providers({ children }: { children: React.ReactNode }) {
  // Provide a unique id for the DndContext
  const dndId = useId();

  const { addNode, nodes, edges } = useStore((state) => state);

  // If the drag ends over the droppable area, add a new node
  function handleDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;
    console.log({ active, over, delta });

    if (!over || active.id === over.id) return;

    if (over.id === DROPPABLE) {
      const node = {
        id: nanoid(),
        type: active.id as string,
        data: { label: `Node ${nodes.length + 1}` },
        position: {
          // Ensure the node is dropped within the window
          x: Math.max(window.innerWidth + delta.x, 0),
          y: Math.max(delta.y + 15, 0),
        },
      };

      // Add the new node to the store
      addNode(node);
    }
  }

  return (
    <DndContext id={dndId} onDragEnd={handleDragEnd}>
      {/* <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 5000,
        }}
      /> */}
      {children}
    </DndContext>
  );
}

export default Providers;
