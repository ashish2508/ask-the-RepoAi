"use client";

import { LoadingLink } from "@/components/navigation/loading-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import { readStreamableValue } from "ai/rsc";
import {
  ArrowUp,
  BookOpen,
  Check,
  FileCode2,
  FolderOpen,
  LoaderCircle,
  MessageSquareText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "sonner";
import { askQuestion } from "./actions";

const Markdown = dynamic(
  () => import("@uiw/react-md-editor").then((module) => module.default.Markdown),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-32 animate-pulse bg-muted/40 p-5 text-sm text-muted-foreground">
        Preparing the response view…
      </div>
    ),
  },
);

type AskQuestionCardProps = {
  compact?: boolean;
};

type ReferencedFile = {
  fileName: string;
  sourceCode: string;
  summary: string;
};

const AskQuestionCard = ({ compact = false }: AskQuestionCardProps) => {
  const { project } = useProject();

  const [loading, setLoading] = React.useState(false);
  const [filesReferenced, setFilesReferenced] = React.useState<ReferencedFile[]>([]);
  const [answer, setAnswer] = React.useState("");
  const [question, setQuestion] = React.useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id || !question.trim() || loading) return;

    setAnswer("");
    setFilesReferenced([]);
    setLoading(true);

    try {
      const { output, filesReferenced } = await askQuestion(question, project.id);
      const uniqueFiles = Array.from(
        new Map(filesReferenced.map((file) => [file.fileName, file])).values(),
      );
      setFilesReferenced(uniqueFiles);

      for await (const delta of readStreamableValue(output)) {
        if (delta) setAnswer((ans) => ans + delta);
      }
    } catch (error) {
      console.error("Question could not be answered:", error);
      toast.error(error instanceof Error ? error.message : "Could not answer that question.");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <LoadingLink
        href="/qa"
        loadingLabel="Opening workbench…"
        className="group relative col-span-3 overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(120deg,rgba(244,145,73,0.12),transparent_48%),var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
      >
        <div className="absolute -right-10 -top-14 size-40 rounded-full border border-primary/20 bg-primary/10 blur-sm transition group-hover:scale-110" />
        <div className="relative flex min-h-44 flex-col justify-between gap-8">
          <div className="flex items-start justify-between">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <MessageSquareText className="size-5" />
            </div>
            <span className="rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary">Open workspace</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Ask your codebase</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Search the repository with grounded answers and a clear trail of the files behind them.</p>
          </div>
        </div>
      </LoadingLink>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--secondary),transparent)]" />
        <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-primary">
              <div className="grid size-10 place-items-center rounded-2xl bg-primary/10"><Sparkles className="size-5" /></div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Repository intelligence</span>
            </div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">What are you trying to understand?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Ask about architecture, behavior, or a specific file. Every answer is grounded in the indexed repository.</p>
          </div>
          <div className="hidden justify-end gap-2 text-xs text-muted-foreground lg:flex">
            <span className="rounded-full border border-border bg-muted/40 px-3 py-1.5">Semantic search</span>
            <span className="rounded-full border border-border bg-muted/40 px-3 py-1.5">Cited context</span>
          </div>
        </div>
        <form onSubmit={onSubmit} className="border-t border-border/70 bg-muted/20 p-4 md:p-5">
          <div className="relative rounded-2xl border border-border bg-background shadow-sm transition focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
            <Textarea
              placeholder="Try: How does authentication flow from sign-in to the protected dashboard?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              maxLength={4000}
              disabled={!project || loading}
              className="min-h-28 resize-none border-0 bg-transparent pr-16 text-sm leading-6 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
              <span className="text-xs text-muted-foreground">{question.length.toLocaleString()}/4,000 characters</span>
              <Button type="submit" size="icon" aria-label="Ask repository" disabled={!project || !question.trim() || loading} className="size-10 rounded-xl">
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
              </Button>
            </div>
          </div>
        </form>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section className="min-h-[28rem] rounded-3xl border border-border/80 bg-card p-6 shadow-sm md:p-8">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-secondary/15 text-secondary"><BookOpen className="size-4" /></div>
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Answer</p><p className="text-sm font-medium">{loading ? "Reading the repository" : answer ? "Repository response" : "Ready when you are"}</p></div>
            </div>
            {answer && !loading && <Button variant="ghost" size="sm" onClick={() => { setAnswer(""); setFilesReferenced([]); }}><RotateCcw className="mr-2 size-3.5" /> New answer</Button>}
          </div>
          {answer || loading ? (
            <Markdown source={answer || "Searching relevant files and composing an answer..."} className="repoai-markdown" />
          ) : (
            <div className="grid min-h-80 place-items-center text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><MessageSquareText className="size-6" /></div>
                <h3 className="mt-5 text-lg font-semibold">Your answer will appear here</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Start with a question above. RepoAI will show the reasoning context alongside the response.</p>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border/70 pb-4"><FolderOpen className="size-4 text-primary" /><div><p className="text-sm font-semibold">Source trail</p><p className="text-xs text-muted-foreground">Files used for this answer</p></div></div>
          {filesReferenced.length > 0 ? (
            <ul className="mt-4 space-y-2">{filesReferenced.map((file) => <li key={file.fileName} className="flex items-start gap-2 rounded-xl border border-border/70 bg-muted/25 px-3 py-2.5"><FileCode2 className="mt-0.5 size-3.5 shrink-0 text-primary" /><span className="min-w-0 break-all font-mono text-xs leading-5">{file.fileName}</span><Check className="ml-auto mt-0.5 size-3 shrink-0 text-secondary" /></li>)}</ul>
          ) : <div className="mt-8 text-center"><FolderOpen className="mx-auto size-7 text-muted-foreground/50" /><p className="mt-3 text-xs leading-5 text-muted-foreground">Referenced files will collect here after you ask a question.</p></div>}
        </aside>
      </div>
    </div>
  );
};

export default AskQuestionCard
