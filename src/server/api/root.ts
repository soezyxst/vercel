import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from './routers/user';
import { qnaRouter } from './routers/qna';
import { linkPentingRouter } from './routers/link-penting';
import { announcementRouter } from './routers/announcement';
import { voteRouter } from './routers/vote';
import { grandRouter } from './routers/grand';
import { activityRouter } from './routers/activity';
import { attendanceRouter } from './routers/attendance';
import { bikeRouter } from './routers/bike';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  qna: qnaRouter,
  link: linkPentingRouter,
  announcement: announcementRouter,
  vote: voteRouter,
  grand: grandRouter,
  activity: activityRouter,
  attendance: attendanceRouter,
  bike: bikeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
