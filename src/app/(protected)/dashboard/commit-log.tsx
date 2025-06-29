'use client'

import MagneticWrapper from '@/components/ui/magnetic-wrapper'
import useProject from '@/hooks/use-project'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

const CommitLog = () => {
  const { projectId } = useProject()
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: projectId!,
  })
  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIdx) => {
          return (
            <li key={commit.id} className=" relative flex gap-x-4 ">
              <div className={cn(
                commitIdx === commits.length ? 'h-6' : '-bottom-0',
                'absolute left-0 top-0 justify-center flex w-6',
              )}>
                <div className="w-px translate-x-1 bg-gray-200 "></div>
              </div>
              <>
              <MagneticWrapper>
                <img src={commit.commitAuthorAvatar} alt="commit  Avatar"className='relative mt-4 size-8 flex-none rounded-full bg-gray-50' />
              </MagneticWrapper>
              </>
              <p className="mt-1">{commit.summary}</p>
            </li>
          )
        })}

      </ul>
    </>
  )
}

export default CommitLog
