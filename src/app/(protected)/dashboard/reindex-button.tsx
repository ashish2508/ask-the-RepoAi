"use client";

import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reindexRepository } from "./actions";

export default function ReindexButton() {
  const { projectId } = useProject();
  const [pending, setPending] = useState(false);

  async function reindex() {
    if (!projectId || pending) return;
    setPending(true);
    try {
      await reindexRepository(projectId);
      toast.success("Repository index refreshed");
    } catch (error) {
      console.error("Repository re-index failed:", error);
      toast.error(error instanceof Error ? error.message : "Could not refresh repository index");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" onClick={reindex} disabled={!projectId || pending}>
      {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Database className="mr-2 size-4" />}
      {pending ? "Re-indexing repository…" : "Refresh repository index"}
    </Button>
  );
}
