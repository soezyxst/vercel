import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const attendanceRouter = createTRPCRouter({
  createAttendance: adminProcedure
    .input(
      z.object({
        activityId: z.string(),
        startTime: z.date(),
        endTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { activityId, startTime, endTime } = input;

      try {
        const attendance = await ctx.prisma.attendance.create({
          data: {
            activity: {
              connect: {
                id: activityId,
              },
            },
            startTime: startTime,
            endTime: endTime,
            author: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create attendance",
        });
      }
    }),

  updateAttendance: adminProcedure
    .input(
      z.object({
        id: z.string(),
        activityId: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, activityId, startTime, endTime } = input;

      try {
        const attendance = await ctx.prisma.attendance.update({
          where: {
            id: id,
          },
          data: {
            activityId: activityId,
            startTime: startTime,
            endTime: endTime,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update attendance",
        });
      }
    }),

  deleteAttendance: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const attendance = await ctx.prisma.attendance.delete({
          where: {
            id: id,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete attendance",
        });
      }
    }),

  getAttendance: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const attendance = await ctx.prisma.attendance.findUnique({
          where: {
            id: id,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  attendanceCounter: publicProcedure.query(async ({ ctx }) => {
    try {
      const attendance = await ctx.prisma.attendance.groupBy({
        by: ["activityId"],
      });

      return attendance;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get attendance",
      });
    }
  }),

  getAttendanceByActivity: publicProcedure
    .input(
      z.object({
        activityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { activityId } = input;

      try {
        const attendance = await ctx.prisma.attendance.findMany({
          where: {
            activityId: activityId,
          },

          include: {
            _count: {
              select: {
                attendanceSubmission: {
                  where: {
                    status: "Present",
                  },
                },
              },
            },
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  getAttendanceByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = input;

      try {
        const attendance = await ctx.prisma.attendance.findMany({
          where: {
            authorId: userId,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  getAttendanceByUserAndActivity: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        activityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, activityId } = input;

      try {
        const attendance = await ctx.prisma.attendance.findMany({
          where: {
            authorId: userId,
            activityId: activityId,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  submitAttendance: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["Present", "Permitted"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      try {
        const attendance = await ctx.prisma.attendanceSubmission.create({
          data: {
            attendanceId: id,
            status: status,
            authorId: ctx.session?.user.id,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit attendance",
        });
      }
    }),

  adminAddAttendanceSubmission: adminProcedure
    .input(
      z.object({
        attendanceId: z.string(),
        status: z.enum(["Present", "Permitted"]),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { attendanceId, status, userId } = input;

      try {
        const attendance = await ctx.prisma.attendanceSubmission.create({
          data: {
            attendanceId: attendanceId,
            status: status,
            authorId: userId,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit attendance",
        });
      }
    }),

  updateAttendanceSubmission: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["Present", "Permitted"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      try {
        const attendance = await ctx.prisma.attendanceSubmission.update({
          where: {
            id: id,
          },
          data: {
            status: status,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update attendance",
        });
      }
    }),

  deleteAttendanceSubmission: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const attendance = await ctx.prisma.attendanceSubmission.delete({
          where: {
            id: id,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete attendance",
        });
      }
    }),

  countIsPresent: publicProcedure
    .input(
      z.object({
        activityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const attendance = await ctx.prisma.attendanceSubmission.count({
          where: {
            attendance: {
              activityId: input.activityId,
            },
            status: "Present",
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  countIsPermitted: publicProcedure
    .input(
      z.object({
        activityId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const attendance = await ctx.prisma.attendanceSubmission.count({
          where: {
            attendance: {
              activityId: input.activityId,
            },
            status: "Permitted",
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get attendance",
        });
      }
    }),

  submitPermission: publicProcedure
    .input(
      z.object({
        submissionId: z.string(),
        content: z.string(),
        filePath: z.string().optional(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { submissionId, content, filePath, type } = input;

      try {
        const attendance = await ctx.prisma.permission.create({
          data: {
            submissionId: submissionId,
            content: content,
            filePath: filePath,
            type: type,
          },
        });

        return attendance;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit permission",
        });
      }
    }),

  userSubmissions: publicProcedure.query(async ({ ctx }) => {
    try {
      const attendance = await ctx.prisma.attendanceSubmission.findMany({
        where: {
          authorId: ctx.session?.user.id,
        },
      });

      return attendance;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get attendance",
      });
    }
  }),
});
