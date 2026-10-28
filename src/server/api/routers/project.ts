import { pollCommits } from "@/lib/github";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { indexGithubRepo } from "@/lib/github-loader";
import { after } from "next/server";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        githubUrl: z.string().min(1, "Github repository url is required"),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          userToProjects: {
            create: {
              userId: ctx.user.dbUserId,
            },
          },
        },
      });
      after(async () => {
        try {
          await indexGithubRepo(
            project.id,
            input.githubUrl,
            input.githubToken,
          );
          await pollCommits(project.id);
        } catch (error) {
          console.error(`Background indexing failed for project ${project.id}:`, error);
        }
      });
      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.dbUserId,
          },
        },
        deletedAt: null,
      },
    });
    return projects;
  }),
  getCommits: protectedProcedure.input(z.object({
      projectId: z.string().min(1, "Project ID is required"),
    })).query(async ({ ctx, input }) => {
      pollCommits(input.projectId).then().catch(console.error);
      const commits = await ctx.db.commit.findMany({
        where: { projectId: input.projectId,},
        orderBy: {
          createdAt: "desc",
        },
      });
      return commits;
    }),
});
