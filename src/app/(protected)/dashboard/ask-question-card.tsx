'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import { DialogTitle } from "@radix-ui/react-dialog";
import MDEditor from "@uiw/react-md-editor";
import { readStreamableValue } from "ai/rsc";
import Image from "next/image";
import React from "react";
import { askQuestion } from "./actions";

const AskQuestionCard = () => {
  const { project } = useProject();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filesReferenced, setFilesReferenced] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
  const [answer, setAnswer] = React.useState("");

  const [question, setQuestion] = React.useState('');

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.currentTarget.blur();
    }
  };



  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferenced([]);
    e.preventDefault();
    if (!project?.id) return
    setLoading(true);
    setOpen(true)

    const { output, filesReferenced } = await askQuestion(question, project.id);
    setFilesReferenced(filesReferenced);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer(ans => ans + delta)
      }
      console.log(answer);
    }
    setLoading(false);

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
          <MDEditor.Markdown source={answer} className="max-w-[70vw] !h-full max-h-[40vh] overflow-scroll" />
          <div className="flex justify-center">
            <Button type="button" className="w-fit" onClick={() => setOpen(false)}>
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
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Ask your question about the code"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
