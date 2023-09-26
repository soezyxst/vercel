import { TRPCError } from "@trpc/server";
import { AnnouncementType } from "@prisma/client";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const announcementRouter = createTRPCRouter({
  createAnnouncement: adminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        type: z.nativeEnum(AnnouncementType),
        filePath: z.string().optional(),
        date: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const announcement = await ctx.prisma.announcement.create({
          data: {
            title: input.title,
            content: input.content,
            type: input.type,
            filePath: input.filePath,
            date: input.date,
            author: {
              connect: {
                id: ctx.session.user?.id,
              },
            },
          },
        });

        return {
          message: "Announcement created successfully",
          announcement,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create announcement",
        });
      }
    }),

  updateAnnouncement: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        type: z.nativeEnum(AnnouncementType),
        filePath: z.string().optional(),
        date: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const announcement = await ctx.prisma.announcement.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            content: input.content,
            type: input.type,
            filePath: input.filePath,
            date: input.date,
            author: {
              connect: {
                id: ctx.session.user?.id,
              },
            },
          },
        });

        return {
          message: "Announcement updated successfully",
          announcement,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update announcement",
        });
      }
    }),

  deleteAnnouncement: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const announcement = await ctx.prisma.announcement.delete({
          where: {
            id: input.id,
          },
        });
        return {
          message: "Announcement deleted successfully",
          announcement,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete announcement",
        });
      }
    }),

  getAnnouncements: publicProcedure
    .input(
      z.object({
        type: z.nativeEnum(AnnouncementType).optional(),
        filter: z.string().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let where = {};

      if (input.filter) {
        where = {
          type: input.type,
          OR: [
            {
              title: {
                contains: input.filter,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: input.filter,
                mode: "insensitive",
              },
            },
          ],
        };
      } else {
        where = {
          type: input.type,
        };
      }

      const announcements = await ctx.prisma.announcement.findMany({
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

      return announcements;
    }),

  getAnnouncementsTitle: publicProcedure
    .input(
      z.object({
        type: z.string().optional(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type } = input;
      const { prisma } = ctx;

      let where = {};
      if (type !== "all") {
        where = {
          type: type,
        };
      } else {
        where = {};
      }

      const announcements = await prisma.announcement.findMany({
        where: where,
        select: {
          id: true,
          title: true,
          type: true,
        },
        orderBy: {
          date: "desc",
        },
        take: input.take,
      });

      return announcements;
    }),

  getAnnouncement: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const announcement = await ctx.prisma.announcement.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: {
            include: {
              profile: true,
            }
          }
        }
      });

      return announcement;
    }),
});
