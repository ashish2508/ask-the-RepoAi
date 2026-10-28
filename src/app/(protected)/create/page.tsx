"use client";

import { LoadingLink } from "@/components/navigation/loading-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { AlertCircle, ArrowRight, CheckCircle2, Github, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const router = useRouter();
  const { setProjectId } = useProject();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();
  const [creationError, setCreationError] = useState("");

  async function onSubmit(data: FormInput) {
    setCreationError("");
    createProject.mutate(
      {
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: async (project) => {
          toast.success("Project created. Repository indexing is running in the background.");
          setProjectId(project.id);
          await refetch();
          reset();
          router.push("/dashboard");
        },
        onError: (error) => {
          console.error("Error creating project:", error);
          setCreationError(error.message || "Failed to create project. Please try again.");
        },
      },
    );
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-6xl items-center gap-10 py-8 lg:grid-cols-[.8fr_1.2fr]">
      <div className="hidden border-l-2 border-primary pl-7 lg:block">
        <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-primary"><Github className="size-4" /> New workspace</p>
        <h1 className="max-w-md text-5xl font-semibold leading-[.95] tracking-[-.06em]">Put a repository on the workbench.</h1>
        <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">Connect GitHub once. RepoAI will index the code, surface the recent changes, and give your team a place to ask better questions.</p>
        <div className="mt-10 space-y-4 text-sm text-muted-foreground"><p><CheckCircle2 className="mr-3 inline size-4 text-primary" />Private repositories supported</p><p><CheckCircle2 className="mr-3 inline size-4 text-primary" />Indexing continues in the background</p><p><CheckCircle2 className="mr-3 inline size-4 text-primary" />You can refresh the index anytime</p></div>
      </div>
      <div className="w-full border border-border bg-card p-6 shadow-sm md:p-9">
        <div className="mb-8 flex items-start justify-between gap-5">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-primary">01 / Connect repository</p><h2 className="text-3xl font-semibold tracking-tight">Create a project</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your project opens automatically when setup succeeds.</p></div>
          <LoadingLink href="/dashboard" loadingLabel="Going back…" className="hidden items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:flex"><ArrowRight className="size-3.5 rotate-180" /> Dashboard</LoadingLink>
        </div>
        {creationError && (
          <div role="alert" className="mb-6 flex items-start gap-3 border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Project creation failed</p>
              <p className="mt-1 leading-5">{creationError}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4" onClick={() => setCreationError("")}>
                  <RotateCcw className="size-3.5" /> Try again
                </button>
                <LoadingLink href="/dashboard" loadingLabel="Going back…" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4">
                  <ArrowRight className="size-3.5" /> Go to dashboard
                </LoadingLink>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <label className="mb-2 block text-sm font-medium" htmlFor="projectName">Project name</label>
          <Input id="projectName" autoComplete="off" {...register("projectName", { required: true })} placeholder="e.g. Storefront" type="text" required className="h-12 rounded-lg" />
          <label className="mb-2 mt-5 block text-sm font-medium" htmlFor="repoUrl">GitHub repository URL</label>
          <Input id="repoUrl" autoComplete="off" {...register("repoUrl", { required: true })} placeholder="https://github.com/owner/repository" type="url" required className="h-12 rounded-lg" />
          <label className="mb-2 mt-5 block text-sm font-medium" htmlFor="githubToken">GitHub token <span className="font-normal text-muted-foreground">(optional, for private repositories)</span></label>
          <Input id="githubToken" {...register("githubToken")} placeholder="ghp_…" type="password" autoComplete="new-password" className="h-12 rounded-lg" />
          <Button
            type="submit"
            className="mt-5 h-12 w-full cursor-pointer rounded-lg text-sm font-semibold"
            disabled={createProject.isPending}
          >
            {createProject.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            {createProject.isPending ? "Creating project…" : "Create project"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default CreatePage;
