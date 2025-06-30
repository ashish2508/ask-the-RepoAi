'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";

const AskQuestionCard = () => {
  const { project } = useProject();
  return (
    <>
    <Card className="bg-gray-200/20 dark:bg-transparent">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Textarea placeholder="Ask your question about the code"/>
          <div className="h-4"></div>
          <Button type="submit">Ask the repo</Button>
        </form>
      </CardContent>
    </Card>
    </>
  )
}

export default AskQuestionCard
