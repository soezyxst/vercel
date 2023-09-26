import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const voteRouter = createTRPCRouter({
  vote: protectedProcedure
    .input(
      z.object({
        answerId: z.string().optional(),
        questionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { answerId, questionId } = input;
      const { prisma, session } = ctx;

      try {
        const vote = await prisma.vote.create({
          data: answerId
            ? {
                answer: {
                  connect: {
                    id: answerId,
                  },
                },
                author: {
                  connect: {
                    id: session.user.id,
                  },
                },
              }
            : {
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
          message: "Voted successfully",
          vote,
        };
      } catch (error) {
        let message = "Something went wrong";
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            message = "You already voted";
          } else {
            message = "Something went wrong with the database";
          }
        } else if (error instanceof PrismaClientInitializationError) {
          message = "Something went wrong when initializing the database";
        } else if (error instanceof PrismaClientRustPanicError) {
          message = "Rust panic error";
        } else if (error instanceof PrismaClientValidationError) {
          message = "Validation error";
        } else if (error instanceof PrismaClientUnknownRequestError) {
          message = "Unknown request error";
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: message ? message : "Something went wrong",
        });
      }
    }),

  unvote: protectedProcedure
    .input(
      z.object({
        questionId: z.string().optional(),
        answerId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId, answerId } = input;
      const { prisma } = ctx;

      try {
        const vote = await prisma.vote.delete({
          where: questionId
            ? {
                authorId_questionId: {
                  authorId: ctx.session.user.id,
                  questionId,
                },
              }
            : {
                authorId_answerId: {
                  authorId: ctx.session.user.id,
                  answerId: answerId!,
                },
              },
        });

        return {
          message: "Unvoted successfully",
          vote,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  isVoted: protectedProcedure
    .input(
      z.object({
        questionId: z.string().optional(),
        answerId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { questionId, answerId } = input;
      const { prisma, session } = ctx;

      try {
        const vote = await prisma.vote.findFirst({
          where: questionId
            ? {
                questionId,
                authorId: session.user.id,
              }
            : {
                answerId: answerId!,
                authorId: session.user.id,
              },
        });

        return !!vote;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
