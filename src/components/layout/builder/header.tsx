import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-20 py-3">
      <Image src="/logo.svg" alt="logo" width={125} height={125} />

      <div className="flex items-center gap-3">
        <Button disabled>Deploy</Button>

        <Button variant="success">
          <CirclePlay className="h-4 w-4" />
          Run
        </Button>
      </div>
    </header>
  );
}
