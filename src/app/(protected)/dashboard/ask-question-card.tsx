'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import React from "react";

const AskQuestionCard = () => {
  const { project } = useProject();

  const [open, setOpen] = React.useState(false);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(true)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("askQuestion");
    }
    setQuestion("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
          </DialogTitle>
          <p className="text-sm text-muted-foreground">We'll try to help you understand the code better.</p>
        </DialogHeader>
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
