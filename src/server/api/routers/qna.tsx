import { QuestionStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const qnaRouter = createTRPCRouter({
  getQuestions: publicProcedure
    .input(
      z.object({
        filterBy: z.enum(["all", "answered", "unanswered"]).optional(),
        search: z.string().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { filterBy, search } = input;
      const status =
        filterBy === "answered"
          ? QuestionStatus.ANSWERED
          : filterBy === "unanswered"
          ? QuestionStatus.UNANSWERED
          : undefined;
      let where = {};

      if (search) {
        where = {
          status: status,
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        };
      } else {
        where = {
          status: status,
        };
      }

      const questions = await prisma.question.findMany({
        where,
        take: input.take,
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          _count: {
            select: {
              votes: true,
              answers: true,
            },
          },
        },
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            votes: {
              _count: "desc",
            },
          },
        ],
      });
      return questions;
    }),

  getQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      const question = await prisma.question.findUnique({
        where: {
          id: id,
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          answers: {
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              votes: true,
              answers: true,
            },
          },
        },
      });
      return question;
    }),

  createQuestion: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        filePath: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { title, content, filePath } = input;

      try {
        const question = await prisma.question.create({
          data: {
            title: title,
            content: content,
            filePath: filePath,
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        return {
          message: "Question created successfully",
          question,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create question",
        });
      }
    }),

  deleteQuestion: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      try {
        const question = await prisma.question.delete({
          where: {
            id: id,
          },
        });

        return {
          message: "Question deleted successfully",
          question,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete question",
        });
      }
    }),

  getQuestionsTitle: publicProcedure
    .input(z.object({ take: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;

      try {
        const questions = await prisma.question.findMany({
          take: input.take,
          include: {
            author: {
              include: {
                profile: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });

        return questions;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get question titles",
        });
      }
    }),

  getAnswers: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { questionId } = input;

      try {
        const answers = await prisma.answer.findMany({
          where: {
            questionId: questionId,
          },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              votes: {
                _count: "desc",
              },
            },
          ],
        });

        return answers;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get answers",
        });
      }
    }),

  createAnswer: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        content: z.string(),
        filePath: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { questionId, content, filePath } = input;

      try {
        const answer = await prisma.answer.create({
          data: {
            content: content,
            filePath: filePath,
            question: {
              connect: {
                id: questionId,
              },
            },
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        return {
          message: "Answer created successfully",
          answer,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create answer",
        });
      }
    }),

  deleteAnswer: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;

      try {
        const answer = await prisma.answer.delete({
          where: {
            id: id,
          },
        });

        return {
          message: "Answer deleted successfully",
          answer,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete answer",
        });
      }
    }),
});
