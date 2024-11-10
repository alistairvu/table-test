import { useEffect, useState } from "react";
import { TableInput } from "../ui/table-input";
import { type CellContext } from "@tanstack/react-table";
import { type JsonValue } from "@prisma/client/runtime/library";

type BaseTableCellProps = CellContext<
  {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    rowData: JsonValue;
    tableId: string | null;
    index: number;
  },
  string | number
>;

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

  const onBlur = () => {
    if (table.options.meta?.updateData) {
      table.options.meta?.updateData(row.id, column.id, value);
    }
  };

  return (
    <TableInput
      className="rounded-none border-hidden px-2 py-2"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
