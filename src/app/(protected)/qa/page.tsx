"use client";

import { LoadingLink } from "@/components/navigation/loading-link";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import { ArrowRight, Bot, FolderGit2 } from "lucide-react";
import AskQuestionCard from "../dashboard/ask-question-card";

export default function QAPage() {
  const { project } = useProject();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bot className="size-5" /></div>
          <p className="text-sm font-medium text-muted-foreground">Repository Q&amp;A</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Ask your codebase</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Get answers grounded in your repository, with the files used to build each response.</p>
        </div>
        {project && <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm"><FolderGit2 className="size-4 text-primary" /><span className="max-w-48 truncate font-medium">{project.name}</span></div>}
      </header>
      {project ? (
        <AskQuestionCard />
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-background/60 px-6 py-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><FolderGit2 className="size-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">Choose a project to get started</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Select a repository in the sidebar, or connect a GitHub repository to start asking questions.</p>
          <Button asChild className="mt-5 rounded-xl"><LoadingLink href="/create" loadingLabel="Opening setup…">Connect a repository <ArrowRight className="ml-2 size-4" /></LoadingLink></Button>
        </div>
      )}
    </div>
  );
}
