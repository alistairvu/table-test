import { type Row, type Prisma } from "@prisma/client";
import { useOptimistic } from "react";

type UseRowsParams = {
  rows: Row[];
};

type UseRowsAction = {
  type: "EDIT";
  payload: {
    rowId: string;
    columnId: string;
    value: string | number;
  };
};

export const useRows = ({ rows }: UseRowsParams) => {
  return useOptimistic(rows, (currentState, action: UseRowsAction) => {
    switch (action.type) {
      // Handles the renaming of a column
      case "EDIT":
        return currentState.map((row) => {
          if (row.id !== action.payload.rowId) {
            return row;
          }

          const rowData = row.rowData as Prisma.JsonObject;

          return {
            ...row,
            rowData: {
              ...rowData,
              [action.payload.columnId]: action.payload.value,
            },
          };
        });

      default:
        return currentState;
    }
  });
};
