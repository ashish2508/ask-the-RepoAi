"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MagneticWrapper from "@/components/ui/magnetic-wrapper";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();
  function onSubmit(data: FormInput) {
    createProject.mutate(
      {
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created. Repository indexing is running in the background.");
          refetch();
          window.location.reload();
          reset();
        },
        onError: (error) => {
          console.error("Error creating project:", error);
          toast.error("Failed to create project. Please try again.");
        },
      },
    );
    return true;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-5xl items-center justify-center gap-12 py-10">
      <MagneticWrapper>
        <Image
          src="/assets/slap.png"
          alt="Create Project"
          width={400}
          height={400}
          priority
          className="hidden h-72 w-auto rounded-2xl object-cover shadow-2xl shadow-indigo-950/10 transition-transform duration-300 hover:scale-[1.02] md:block"
        />
      </MagneticWrapper>
      <div className="w-full max-w-lg rounded-3xl border border-border/70 bg-background/80 p-7 shadow-xl shadow-black/5 backdrop-blur md:p-9">
        <div className="mb-7">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-primary">Start with a repository</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Bring your code into focus
          </h1>
          <p className="text-muted-foreground text-sm">
            Connect a GitHub repository to explore its code, ask questions, and follow changes.
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <label className="mb-2 block text-sm font-medium" htmlFor="projectName">Project name</label>
            <Input id="projectName" autoComplete="off" {...register("projectName", { required: true })} placeholder="e.g. Storefront" type="text" required className="h-12 rounded-xl" />
            <label className="mb-2 mt-5 block text-sm font-medium" htmlFor="repoUrl">GitHub repository URL</label>
            <Input id="repoUrl" autoComplete="off" {...register("repoUrl", { required: true })} placeholder="https://github.com/owner/repository" type="url" required className="h-12 rounded-xl" />
            <label className="mb-2 mt-5 block text-sm font-medium" htmlFor="githubToken">GitHub token <span className="font-normal text-muted-foreground">(optional, for private repositories)</span></label>
            <Input id="githubToken" {...register("githubToken")} placeholder="ghp_…" type="password" autoComplete="new-password" className="h-12 rounded-xl" />
            <Button
              type="submit"
              className="mt-3 h-12 w-full cursor-pointer rounded-xl text-sm font-semibold"
              disabled={createProject.isPending}
            >
              {createProject.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
