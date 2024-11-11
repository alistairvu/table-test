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
      include: {
        cells: true,
      },
      // orderBy: {
      //   index: "asc",
      // },
    });
  }

  async editTextCell(cellId: string, value: string) {
    return this.db.cell.update({
      where: {
        id: cellId,
      },
      data: {
        textValue: value,
        intValue: null,
      },
    });
  }

  async editIntCell(cellId: string, value: number) {
    return this.db.cell.update({
      where: {
        id: cellId,
      },
      data: {
        textValue: String(value),
        intValue: value,
      },
    });
  }
}
