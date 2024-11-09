import { type Prisma, type PrismaClient } from "@prisma/client";

/**
 * Handles logic related to a base
 */
export class BaseController {
  constructor(private db: PrismaClient) {}

  /**
   * Gets the current base in the system. There is only ONE base.
   */
  async get() {
    return this.db.base.findFirstOrThrow({
      include: {
        tables: {
          include: {
            columns: true,
          },
        },
      },
    });
  }

  /**
   * Gets the current base in the system. There is only ONE base.
   */
  async getTables() {
    return this.db.base.findFirstOrThrow({
      include: {
        tables: {
          include: {
            columns: true,
          },
        },
      },
    });
  }

  // /**
  //  * Handles the creation of a new table in a base.
  //  *
  //  * @param baseId The id of the base
  //  */
  // async createTable(baseId: number) {
  //   const tableCounts = await this.db.table.count({
  //     where: {
  //       baseId,
  //     },
  //   });

  //   return this.db.table.create({
  //     data: {
  //       baseId: baseId,
  //       name: `Table ${tableCounts + 1}`,
  //       rows: [] as Prisma.JsonArray,
  //       order: tableCounts + 1,
  //     },
  //   });
  // }
}
