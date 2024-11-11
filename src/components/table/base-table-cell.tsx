import { useEffect, useState } from "react";
import { TableInput } from "../ui/table-input";
import { type CellContext } from "@tanstack/react-table";
import { type RowWithCells } from "~/@types";

type BaseTableCellProps = CellContext<RowWithCells, string | number>;

export const BaseTableCell = ({
  getValue,
  row,
  column,
  table,
}: BaseTableCellProps) => {
  const initialValue = getValue();

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    if (value !== initialValue) {
      console.log(`editing cell ${row.id}`);
      table.options.meta?.updateData?.(row.id, column.id, value);
    }
  };

  return (
    <TableInput
      className="my-0 rounded-none border-hidden px-2 py-2 shadow-none"
      value={value}
      onBlur={handleBlur}
      onChange={(e) => setValue(e.target.value)}
      type={table.options.meta?.isNumber?.(column.id) ? "number" : "text"}
    />
  );
};
