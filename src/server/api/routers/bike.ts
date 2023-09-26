import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const bikeRouter = createTRPCRouter({
  createNew: publicProcedure
    .input(
      z.object({
        tokenId: z.string(),
        name: z.string(),
        nim: z.string(),
        email: z.string(),
        bikeNumber: z.number(),
        active: z.boolean(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { tokenId, name, nim, email, bikeNumber, active, password } = input;

      const user = await prisma.bikeUser.findUnique({
        where: {
          nim
        }
      })

      if (user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "User has been registered"
        })
      }

      let values = undefined;
      try {
        values = await prisma.bikeUser.create({
          data: {
            name,
            nim,
            email,
            active,
            passwordHash: await hash(password, 10),
            bike: {
              connect: {
                number: bikeNumber,
              },
            },
            token: {
              connect: {
                id: tokenId,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  updateBikeUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tokenId: z.string().optional(),
        name: z.string().optional(),
        nim: z.string().optional(),
        email: z.string().optional(),
        bikeId: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { tokenId, name, nim, email, bikeId, active, id } = input;
      let values = undefined;
      try {
        values = await prisma.bikeUser.update({
          where: {
            id,
          },
          data: {
            name,
            nim,
            email,
            active,
            bike: {
              connect: {
                id: bikeId,
              },
            },
            token: {
              connect: {
                id: tokenId,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  deleteBikeUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      let values = undefined;
      try {
        values = await prisma.bikeUser.delete({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  getNewToken: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    let values = undefined;
    try {
      values = await prisma.bikeToken.findFirst({
        where: {
          bikeUser: {
            is: null,
          },
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
    return values;
  }),

  getBikeUser: publicProcedure
    .input(
      z.object({
        take: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { take, skip } = input;
      let values = undefined;
      try {
        values = await prisma.bikeUser.findMany({
          take,
          skip,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  getBikeUserById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      let values = undefined;
      try {
        values = await prisma.bikeUser.findUnique({
          where: {
            id,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  getBikeUserByNIM: protectedProcedure
    .input(
      z.object({
        nim: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { nim } = input;
      let values = undefined;
      try {
        values = await prisma.bikeUser.findUnique({
          where: {
            nim,
          },
          include: {
            token: true,
            bike: true,
            bikeRelation: {
              include: {
                token: true,
                bike: true,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  getActivatedBikeUser: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { token } = input;
      const values = await prisma.bikeUser.findFirst({
        where: {
          active: true,
          token: {
            some: {
              token,
              updatedAt: {
                gt: new Date(Date.now() - 15 * 60 * 1000),
              },
            },
          },
        },
      });

      if (!values) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid Token",
        });
      }

      await prisma.bikeUser.update({
        where: {
          id: values.id,
        },
        data: {
          active: true,
        },
      });
    }),

  createToken: adminProcedure
    .input(
      z.object({
        bikeUserId: z.string().optional(),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { bikeUserId, token } = input;
      let values = undefined;
      try {
        values = await prisma.bikeToken.create({
          data: {
            token,
            bikeUser: {
              connect: {
                id: bikeUserId,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
      return values;
    }),

  getTokens: adminProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    let values = undefined;
    try {
      values = await prisma.bikeToken.findMany();
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
    return values;
  }),

  getBikes: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    let values = undefined;
    try {
      values = await prisma.bike.findMany({
        orderBy: {
          number: "asc",
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Server Error",
      });
    }
    return values;
  }),

  getBikeById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { id } = input;
      let value = undefined;
      try {
        value = await prisma.bike.findUnique({
          where: {
            id,
          },
        });
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server Error",
        });
      }

      return value;
    }),

  addNewRelation: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        bikeNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { token, bikeNumber } = input;

      const relation = await prisma.bikeRelation.create({
        data: {
          token: {
            connect: {
              token,
            },
          },
          bike: {
            connect: {
              number: bikeNumber,
            },
          },
          bikeUser: {
            connect: {
              nim: ctx.session.user.nim,
            }
          }
        },
      });

      const user = await prisma.bikeUser.update({
        where: {
          nim: ctx.session.user.nim,
        },
        data: {
          token: {
            connect: {
              token,
            }
          },
          bike: {
            connect: {
              number: bikeNumber,
            }
          }
        },
      })

      if (!relation || !user ) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create relation",
        });
      }

      return {
        relation,
        user,
      };
    }),
});
