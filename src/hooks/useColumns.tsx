import { type Column } from "@prisma/client";
import { useOptimistic } from "react";

type UseColumnsParams = {
  columns: Column[];
};

type UseColumnsAction = {
  type: "RENAME";
  payload: {
    columnId: string;
    name: string;
  };
};

export const useColumns = ({ columns }: UseColumnsParams) => {
  return useOptimistic(columns, (currentState, action: UseColumnsAction) => {
    switch (action.type) {
      // Handles the renaming of a column
      case "RENAME":
        return currentState.map((column) => {
          if (column.id !== action.payload.columnId) {
            return column;
          }

          return { ...column, name: action.payload.name };
        });

      default:
        return currentState;
    }
  });
};
