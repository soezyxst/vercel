import { AnnouncementType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const grandRouter = createTRPCRouter({
  getTitles: publicProcedure
    .input(
      z.object({
        category: z.string(),
        take: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { category } = input;
      const { prisma } = ctx;
      let values = undefined;
      const data = {
        select: { id: true, title: true },
        take: input.take,
        orderBy: { createdAt: "desc" as const },
      };

      try {
        if (category === "link-penting") {
          values = await prisma.link.findMany(data);
        } else if (category === "info-angkatan") {
          values = await prisma.announcement.findMany({
            where: {
              type: AnnouncementType.ORGANIZATION,
            },
            select: {
              id: true,
              title: true,
            },
            take: input.take,
            orderBy: { createdAt: "desc" },
          });
        } else if (category === "info-kuliah") {
          values = await prisma.announcement.findMany({
            where: {
              type: AnnouncementType.ACADEMIC,
            },
            select: {
              id: true,
              title: true,
            },
            take: input.take,
            orderBy: { createdAt: "desc" },
          });
        } else if (category === "ujian") {
          values = await prisma.exam.findMany(data);
        } else if (category === "kegiatan-angkatan") {
          values = await prisma.activity.findMany(data);
        } else if (category === "tanya-pr") {
          values = await prisma.question.findMany(data);
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed",
        });
      }

      return values;
    }),
});
