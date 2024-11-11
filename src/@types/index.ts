import { type Row, type Cell } from "@prisma/client";

export type RowWithCells = Row & {
  cells: Cell[];
};
