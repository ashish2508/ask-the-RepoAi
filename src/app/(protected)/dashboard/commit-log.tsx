'use client'

import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'

const CommitLog = () => {
  const { projectId } = useProject()
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: projectId!,
  })
    return (
<></>
    )
}

export default CommitLog
