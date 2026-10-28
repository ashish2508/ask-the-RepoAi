import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const projectsQuery = api.project.getProjects.useQuery(undefined, {
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });
  const [projectId, setProjectId] = useLocalStorage('repoAi-projectId', ' ');
  const project = projectsQuery.data?.find((project) => project.id === projectId);
  return {
    projects: projectsQuery.data,
    project,
    projectId,
    setProjectId,
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
  }
};

export default useProject;
