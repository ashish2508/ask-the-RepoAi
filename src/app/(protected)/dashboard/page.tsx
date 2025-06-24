"use client";
import useProject from "@/hooks/use-project";
import { LucideExternalLink, LucideGithub } from "lucide-react";
import { Sanchez } from 'next/font/google';

// Define Sanchez font with Google Fonts
const sanchez = Sanchez({
  subsets: ['latin'],
  display: 'swap', // Ensures text is visible with fallback during font load
  weight: ['400'], // Regular and Bold for flexibility
});

const DashBoardPage = () => {
  const { project } = useProject();
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        {/* Github Link */}
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <LucideGithub className="size-6 text-pink-300" />
            <div className="ml-2">
              <p className="text-sm font-medium text-slate-300">
                This Project is linked to:{' '}
                <a
                  href={project?.githubUrl ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center text-white/90 hover:underline ${sanchez.className}`}
                >
                  {project?.githubUrl!}
                  <LucideExternalLink className="size-4 ml-1" />
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        
        <div className="flex items-center gap-4">
          TeamMemebrs
          InviteButton
          ArchiveButton 
        </div>
        
      </div>
      
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols:5">
          AskQuestionCard
          MeetingCard 
        </div>
      </div>
      
      <div className="mt-8"></div>
      CommitLog
      
    </div>
  );
};

export default DashBoardPage;
