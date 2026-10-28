"use client";

import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import { ArrowRight, FolderGit2, Github, Sparkles } from "lucide-react";
import Link from "next/link";
import AskQuestionCard from "./ask-question-card";
import CommitLog from "./commit-log";
import ReindexButton from "./reindex-button";

export default function DashboardPage() {
  const { projects, project } = useProject();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Sparkles className="size-4 text-primary" /> Your workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight">{project ? project.name : "Welcome to RepoAI"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{project ? "Explore your codebase, ask a question, or catch up on recent changes." : "Connect a GitHub repository to start exploring your codebase."}</p>
        </div>
        {project && <div className="flex flex-wrap items-center gap-3"><a href={project.githubUrl ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium transition hover:bg-muted"><Github className="size-4" /> View repository</a><ReindexButton /></div>}
      </header>

      {project ? (
        <>
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-5"><AskQuestionCard compact /></section>
          <section className="space-y-4"><div><h2 className="text-xl font-semibold tracking-tight">Recent changes</h2><p className="mt-1 text-sm text-muted-foreground">A readable trail of what changed and why.</p></div><CommitLog /></section>
        </>
      ) : projects?.length ? (
        <div className="rounded-2xl border border-dashed border-border bg-background/60 px-6 py-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><FolderGit2 className="size-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">Select a project</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Choose one of your repositories from the sidebar to see its questions and recent changes.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-background/60 px-6 py-14 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><FolderGit2 className="size-5" /></div>
          <h2 className="mt-4 text-lg font-semibold">Your first repository is one step away</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Connect a GitHub repository and RepoAI will index the code and recent commits for you.</p>
          <Button asChild className="mt-5 rounded-xl"><Link href="/create">Connect a repository <ArrowRight className="ml-2 size-4" /></Link></Button>
        </div>
      )}
    </div>
  );
}
