"use client";

import Flow from "@/components/workflow/flow";
import Header from "@/components/layout/builder/header";
import Droppable from "@/components/DragAndDrop/Droppable";
import Sidepanel from "@/components/workflow/Sidepanel";
import Providers from "./providers";
export default function WorkflowPage() {
  return (
    <>
      <Header />

      <Providers>
        <div className="flow-builder">
          <Sidepanel />
          <main id="main">
            <Droppable>
              <Flow />
            </Droppable>
          </main>
        </div>
      </Providers>
    </>
  );
}
