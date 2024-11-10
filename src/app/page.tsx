import Flow from "@/components/workflow/flow";
import Header from "@/components/layout/builder/header";

export default function WorkflowPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4">
        <Flow />
      </main>
    </>
  );
}
