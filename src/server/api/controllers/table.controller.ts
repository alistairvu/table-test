import { type PrismaClient } from "@prisma/client";

/**
 * Handles logic related to the table
 */
export class TableController {
  constructor(private db: PrismaClient) {}

  async getColumns(tableId: string) {
    return this.db.column.findMany({
      where: {
        tableId,
      },
      orderBy: {
        index: "asc",
      },
    });
  }

  async getRows(tableId: string) {
    return this.db.row.findMany({
      where: {
        tableId,
      },
      // orderBy: {
      //   index: "asc",
      // },
    });
  }
}
