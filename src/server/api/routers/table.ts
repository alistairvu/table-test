import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TableController } from "../controllers/table.controller";

export const tableRouter = createTRPCRouter({
  getRows: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const controller = new TableController(ctx.db);
    const rows = await controller.getRows(input);
    return rows;
  }),

  getColumns: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const controller = new TableController(ctx.db);
      return controller.getColumns(input);
    }),
});
