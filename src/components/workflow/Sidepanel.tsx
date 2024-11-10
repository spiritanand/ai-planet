"use client";

import Draggable from "@/components/DragAndDrop/Draggable";
import { NODES } from "@/lib/constants";
import { MenuIcon, Brain, FileInput, FileOutput } from "lucide-react";

function Sidepanel() {
  return (
    <aside
      id="side-panel"
      className="h-screen border-l bg-background p-6"
      style={{
        height: "calc(100vh - 3.5rem)",
      }}
    >
      <h2 className="mb-4 text-xl font-semibold">Components</h2>
      <div className="mb-4 border-b pb-2">
        <p className="text-sm text-muted-foreground">Drag and Drop</p>
      </div>

      <ul className="flex flex-col space-y-2">
        {Object.values(NODES).map((node) => (
          <Draggable key={node.type} id={node.type}>
            <div className="flex cursor-grab items-center justify-between rounded-md border bg-background p-3 hover:bg-accent/50">
              <div className="flex items-center gap-2">
                {node.type === "input" && <FileInput className="h-5 w-5" />}
                {node.type === "llm" && <Brain className="h-5 w-5" />}
                {node.type === "output" && <FileOutput className="h-5 w-5" />}
                <span className="text-sm">{node.label}</span>
              </div>
              <MenuIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </Draggable>
        ))}
      </ul>
    </aside>
  );
}

export default Sidepanel;
