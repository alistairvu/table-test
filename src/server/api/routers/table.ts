import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TableController } from "../controllers/table.controller";

export const tableRouter = createTRPCRouter({
  countRows: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const controller = new TableController(ctx.db);
    return controller.countRows(input);
  }),

  getRows: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const controller = new TableController(ctx.db);
    const rows = await controller.getRows(input);
    return rows;
  }),

  getInfiniteRows: publicProcedure
    .input(
      z.object({
        tableId: z.string(),
        cursor: z.number().nullish(),
        limit: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const controller = new TableController(ctx.db);

      const limit = input.limit ?? 1000;
      const cursor = input.cursor ?? 0;

      return controller.getInfiniteRows(input.tableId, cursor, limit);
    }),

  getColumns: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const controller = new TableController(ctx.db);
      return controller.getColumns(input);
    }),

  editTextCell: publicProcedure
    .input(
      z.object({
        cellId: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const controller = new TableController(ctx.db);
      const { cellId, value } = input;
      return controller.editTextCell(cellId, value);
    }),

  editIntCell: publicProcedure
    .input(
      z.object({
        cellId: z.string(),
        value: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const controller = new TableController(ctx.db);
      const { cellId, value } = input;
      console.log({ input });
      return controller.editIntCell(cellId, value);
    }),
});
