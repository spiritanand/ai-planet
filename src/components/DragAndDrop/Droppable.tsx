import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { DROPPABLE } from "@/lib/constants";

export default function Droppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: DROPPABLE,
  });

  return <div ref={setNodeRef}>{children}</div>;
}
