"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject =  api.project.createProject.useMutation();
  
  function onSubmit(data: FormInput){
    createProject.mutate({
      name: data.projectName,
      githubUrl: data.repoUrl,
      githubToken: data.githubToken,
    }, {
      onSuccess: () => {
        toast.success("Project created successfully!");
        window.location.reload();
        reset();
      },
      onError: (error) => {
        console.error("Error creating project:", error);
        toast.error("Failed to create project. Please try again.");
      },
    });
    return true
  }
  
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image
        src="/assets/slap.png"
        alt="Create Project"
        width={400}
        height={400}
        priority
        className="h-66 w-auto rounded-2xl transition-transform duration-300 hover:scale-120"
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your GitHub repo to link it to Ask the RepoAi
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              type="text"
              required
            />
            <div className="h-4"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Github repo url"
              type="url"
              required
            />
            <div className="h-4"></div>

            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)" 
            />
            <div className="h-4"></div>
              <Button type='submit' className="cursor-pointer" disabled={createProject.isPending}>
                Create Project
              </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
