"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";
import useStore from "@/lib/store";
import { toast } from "sonner";
// import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export default function Header() {
  const {
    isValidConnections,
    inputNode,
    llmNode,
    outputNode,
    updateInputNodeValue,
    updateLLMNode,
    updateOutputNodeValue,
  } = useStore((state) => state);

  const handleRun = async () => {
    const { isConnectionsValid, hasInputToLLMPath, hasLLMToOutputPath } =
      isValidConnections();

    if (!inputNode) {
      toast.error("No input node", {
        description: "Please add an input node to your pipeline.",
      });
      return;
    }

    if (!llmNode) {
      toast.error("No LLM node", {
        description: "Please add an LLM node to your pipeline.",
      });
      return;
    }

    if (!outputNode) {
      toast.error("No output node", {
        description: "Please add an output node to your pipeline.",
      });
      return;
    }

    if (!hasInputToLLMPath) {
      toast.error("No path from input to LLM", {
        description: "Please check if you have connected the input to the LLM.",
      });
      updateInputNodeValue(inputNode.id, inputNode.data.value, "error");
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      return;
    } else if (!hasLLMToOutputPath) {
      toast.error("No path from LLM to output", {
        description:
          "Please check if you have connected the LLM to the output.",
      });
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      updateOutputNodeValue(outputNode.id, outputNode.data.value, "error");
      return;
    } else if (!isConnectionsValid) {
      toast.error("Invalid connections", {
        description:
          "Please check if you have connected the input to the LLM and the LLM to the output.",
      });
      updateInputNodeValue(inputNode.id, inputNode.data.value, "error");
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      updateOutputNodeValue(outputNode.id, outputNode.data.value, "error");
      return;
    }

    // Check if input value has been provided
    if (!inputNode.data.value.trim()) {
      updateInputNodeValue(inputNode.id, inputNode.data.value, "error");
      toast.error("Please enter a prompt.", {
        description: "This is the prompt that will be used to generate text.",
      });
      return;
    }

    // Check if LLM node has been provided
    if (!llmNode.data.model) {
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      toast.error("Please select an LLM model.", {
        description: "You can find your LLM model in your OpenAI account.",
      });
      return;
    }
    if (!llmNode.data.apiBase) {
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      toast.error("Please enter an API base.", {
        description: "You can find your API base in your OpenAI account.",
      });
      return;
    }
    if (!llmNode.data.apiKey) {
      updateLLMNode(llmNode.id, { ...llmNode.data, status: "error" });
      toast.error("Please enter an API key.", {
        description: "You can find your API key in your OpenAI account.",
      });
      return;
    }

    toast.loading("Running pipeline", {
      description: "This may take a while.",
    });
    updateInputNodeValue(inputNode.id, inputNode.data.value, "success");
    updateLLMNode(llmNode.id, { ...llmNode.data, status: "success" });
    updateOutputNodeValue(outputNode.id, outputNode.data.value, "success");

    try {
      const openai = createOpenAI({
        baseURL: llmNode.data.apiBase,
        apiKey: llmNode.data.apiKey,
      });
      const { text } = await generateText({
        model: openai(llmNode.data.model),
        prompt: inputNode.data.value,
      });

      updateOutputNodeValue(outputNode.id, text, "success");

      toast.dismiss();
      toast.success("Pipeline completed successfully!", {
        description: "You can now see the results in the output node.",
      });
    } catch (error) {
      // TODO: Send over to Posthog
      console.error({ error });
      toast.dismiss();
      toast.error("Error running pipeline", {
        description: "Please try again.",
      });
    }
  };

  return (
    <header className="flex h-[3.5rem] items-center justify-between border-b border-border px-20 py-3">
      <Image src="/logo.svg" alt="logo" width={125} height={125} />

      <div className="flex items-center gap-3">
        {/* <Button disabled>Deploy</Button> */}

        <Button variant="success" onClick={handleRun}>
          <CirclePlay className="h-4 w-4" />
          Run
        </Button>
      </div>
    </header>
  );
}
