'use client'

import MagneticWrapper from '@/components/ui/magnetic-wrapper'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'

const CommitLog = () => {
  const { projectId, project } = useProject()
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: projectId!,
  })
  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, commitIdx) => {
          return (
            <li key={commit.id} className=" relative flex gap-x-4 ">
              <>
                <MagneticWrapper animationDuration={1} elasticity={0.5}>
                  <img
                    src={commit.commitAuthorAvatar || "/assets/default.png"}
                    alt="commit Avatar"
                    className="relative mt-4 size-12 flex-none rounded-full bg-gray-50"
                  />
                </MagneticWrapper>
                <div className="flex-auto rounded-md bg-primary/10 p-3 ring-1 ring-inset ring-emerald-900">
                  <div className="text-sm leading-6 text-black/70
                dark:text-white">
                    <div className="flex justify-baseline gap-x-4">
                      <Link href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                        target='_blank' className="py-0.5 text-xs leading-5 text-gray-500 hover:text-gray-400">
                        <span className="font-extrabold text-base text-emerald-600">
                          {commit.commitAuthorName}
                        </span>{" "}
                        <span className="inline-flex items-center text-accent-foreground/80 text-sm tracking-wider">
                          committed
                          <ExternalLinkIcon className="ml-1 size-4 text-teal-600" />
                        </span>
                      </Link>
                    </div>
                    <span className="font-semibold">
                      {commit.commitMessage}
                    </span>
                    <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-400'>
                      {commit.summary}
                    </pre>
                  </div>

                </div>
              </>
            </li>
          )
        })}

      </ul>
    </>
  )
}

export default CommitLog
