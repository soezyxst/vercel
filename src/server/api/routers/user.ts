import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { compare, hash } from "bcrypt";

export const userRouter = createTRPCRouter({
  getUserInfo: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
        select: {
          nim: true,
          role: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }),

  getUserInfoByNIM: adminProcedure
    .input(
      z.object({
        nim: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          nim: input.nim,
        },
        select: {
          nim: true,
          role: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        nim: true,
        role: true,
        profile: {
          select: {
            name: true,
            email: true,
            prodi: true,
            image: true,
            points: true,
          },
        },
      },
      orderBy: {
        nim: "asc",
      }
    });

    if (!users) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Users not found",
      });
    }
    return users;
  }),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        nim: z.string().optional(),
        role: z.enum(["ADMIN", "USER", "SUPERADMIN"]).optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        prodi: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          nim: input.nim,
        },
        data: {
          role: input.role,
          profile: {
            update: {
              name: input.name,
              email: input.email,
              prodi: input.prodi,
              image: input.image,
            },
          },
        },
        select: {
          nim: true,
          role: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),

  deleteUser: adminProcedure
    .input(
      z.object({
        nim: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          nim: input.nim,
        },
        select: {
          nim: true,
          role: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return user;
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
        select: {
          nim: true,
          role: true,
          passwordHash: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const isPasswordValid = await compare(
        input.oldPassword,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Wrong password",
        });
      }

      const newPassword = await hash(input.newPassword, 10);

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: ctx.session?.user.id,
        },
        data: {
          passwordHash: newPassword,
        },
        select: {
          nim: true,
          role: true,
          profile: {
            select: {
              name: true,
              email: true,
              prodi: true,
              image: true,
              points: true,
            },
          },
        },
      });

      if (!updatedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return updatedUser;
    }),
});
