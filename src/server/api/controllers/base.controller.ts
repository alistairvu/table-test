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
}
