'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import Image from "next/image";
import React from "react";

const AskQuestionCard = () => {
  const { project } = useProject();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesRefrenced, setFilesRefrenced] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
  const [answer, setAnswer] = React.useState("");
  
  const [question, setQuestion] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("askQuestion") || "";
    }
    return "";
  });

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  };

  const handleChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setQuestion(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem("askQuestion", newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project?.id) {
      return
    }
    setLoading(true);
    setOpen(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("askQuestion");
    }
    
    const { output, filesReferenced } = await askQuestion(question, project.id);
    setFilesRefrenced(filesReferenced);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer(ans => ans + delta)
      }
    }
     setLoading(false);
    setQuestion("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Image src="/assets/logo.png" alt="logo" width={100} height={100} />
            </DialogTitle>
          </DialogHeader>
          {answer}
          <h1>File References</h1>
          {filesRefrenced.map((file,index) =>{
            return <span key={index}>{file.fileName}</span>
          })}
          <div className="flex justify-center">
            <Button className="w-fit" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>

        </DialogContent>
      </Dialog>


      <Card className="relative col-span-3 bg-gray-200/20 dark:bg-transparent">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Ask your question about the code"
              value={question}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <div className="h-4"></div>
            <Button type="submit" className="cursor-pointer">Ask the repo</Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default AskQuestionCard
