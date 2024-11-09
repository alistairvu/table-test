import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { BaseController } from "../controllers/base.controller";

export const baseRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const controller = new BaseController(ctx.db);
    return controller.get();
  }),

  getTables: publicProcedure.query(async ({ ctx }) => {
    const controller = new BaseController(ctx.db);
    return controller.getTables();
  }),
});
