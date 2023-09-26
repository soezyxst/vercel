import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const linkPentingRouter = createTRPCRouter({
  createLinkPenting: adminProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        description: z.string(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const linkPenting = await ctx.prisma.link.create({
          data: {
            title: input.title,
            url: input.url,
            description: input.description,
            date: input.date,
            author: {
              connect: {
                id: ctx.session.user?.id,
              },
            },
          },
        });

        return {
          message: "Link created successfully",
          linkPenting,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create link",
        });
      }
    }),

  updateLinkPenting: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        url: z.string().optional(),
        description: z.string().optional(),
        date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const linkPenting = await ctx.prisma.link.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            url: input.url,
            description: input.description,
            date: input.date,
            author: {
              connect: {
                id: ctx.session.user?.id,
              },
            },
          },
        });

        return {
          message: "Link updated successfully",
          linkPenting,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update link",
        });
      }
    }),

  deleteLinkPenting: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.link.delete({
          where: {
            id: input.id,
          },
        });

        return {
          message: "Link deleted successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete link",
        });
      }
    }),

  getLinkPentings: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        filter: z.string().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        let where = {};

        if (input.type === "all") {
          if (input.filter) {
            where = {
              OR: [
                {
                  title: {
                    contains: input.filter,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: input.filter,
                    mode: "insensitive",
                  },
                },
              ],
            };
          } else {
            where = {}
          }
        } else {
          if (input.filter) {
            where = {
              OR: [
                {
                  title: {
                    contains: input.filter,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: input.filter,
                    mode: "insensitive",
                  },
                },
              ],
            };
          } else {
            where = {
            }
          }
        }

        const linkPenting = await ctx.prisma.link.findMany({
          where,
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          take: input.take,
        });

        return {
          message: "Links found successfully",
          linkPenting,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to find link",
        });
      }
    }),

  getLinkPentingsTitle: publicProcedure
    .input(
      z.object({ type: z.string().optional(), take: z.number().optional() })
    )
    .query(async ({ ctx, input }) => {
      try {
        let where = {};

        if (input.type !== "all") {
          where = {
            type: input.type,
          };
        }

        const linkPenting = await ctx.prisma.link.findMany({
          where,
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            date: "desc",
          },
          take: input.take,
        });

        return {
          message: "Links found successfully",
          linkPenting,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to find link",
        });
      }
    }),

  getLinkPenting: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const linkPenting = await ctx.prisma.link.findUnique({
          where: {
            id: input.id,
          },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
          },
        });
        return {
          message: "Link found successfully",
          linkPenting,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to find link",
        });
      }
    }),
});
