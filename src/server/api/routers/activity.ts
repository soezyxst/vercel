import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const activityRouter = createTRPCRouter({
  createActivity: adminProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        filePath: z.string().optional(),
        link: z.string().optional(),
        kuorum: z.number(),
        location: z.string(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, content, filePath, link, location, kuorum, startTime, endTime } = input;

      try {
        const activity = await ctx.prisma.activity.create({
          data: {
            title: title,
            content: content,
            filePath: filePath,
            documentation: link,
            kuorum: kuorum,
            location: location,
            startTime: startTime,
            endTime: endTime,
            author: {
              connect: {
                id: ctx.session?.user.id,
              }
            },
          },
        });

        return activity;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create activity",
        });
      }
    }),

  updateActivity: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        filePath: z.string().optional(),
        link: z.string().optional(),
        kuorum: z.number().optional(),
        location: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, title, content, filePath, link, kuorum, location, startTime, endTime } = input;

      try {
        const activity = await ctx.prisma.activity.update({
          where: {
            id: id,
          },
          data: {
            title: title,
            content: content,
            filePath: filePath,
            documentation: link,
            kuorum: kuorum,
            location: location,
            endTime: endTime,
            startTime: startTime,
          },
        });

        return activity;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update activity",
        });
      }
    }),

  deleteActivity: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const activity = await ctx.prisma.activity.delete({
          where: {
            id: id,
          },
        });

        return activity;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete activity",
        });
      }
    }),

  getActivities: publicProcedure.query(async ({ ctx }) => {
    try {
      const activities = await ctx.prisma.activity.findMany({
        include: {
          atttendance: true,
        },
        orderBy: {
          startTime: 'desc'
        },
      });

      return activities;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get activities",
      });
    }
  }),

  getActivitiesTitle: publicProcedure.query(async ({ ctx }) => {
    try {
      const activities = await ctx.prisma.activity.findMany({
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          startTime: 'desc'
        },
      });

      return activities;
    }
    catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get activities",
      });
    }
  }),

  getActivitiesByDate: publicProcedure
    .input(
      z.object({
        initDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { initDate, endDate } = input;

      try {
        const activities = await ctx.prisma.activity.findMany({
          where: {
            startTime: {
              gt: initDate,
              lt: endDate,
            },
          },
          include: {
            atttendance: true,
          },
          orderBy: {
            startTime: 'desc'
          },
        });

        return activities;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get activities",
        });
      }
    }),

  getActivitiesByMonth: publicProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { month, year } = input;

      try {
        const activities = await ctx.prisma.activity.findMany({
          where: {
            startTime: {
              gt: new Date(year, month - 1, 1),
              lt: new Date(year, month, 0),
            },
          },
          include: {
            atttendance: true,
          },
          orderBy: {
            startTime: 'desc'
          },
        });

        return activities;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get activities",
        });
      }
    }),

  getActivityById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const activity = await ctx.prisma.activity.findUnique({
          where: {
            id: id,
          },
          include: {
            atttendance: true,
          },
        });

        return activity;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get activities",
        });
      }
    }),
});
