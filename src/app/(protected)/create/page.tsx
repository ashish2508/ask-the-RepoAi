"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image
        src="/assets/slap.png"
        alt="Create Project"
        width={300}
        height={300}
        priority
        className="h-56 w-auto"
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-semibold text-2xl">
            
          </h1>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;
