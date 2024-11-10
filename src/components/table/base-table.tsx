"use client";

import {
  flexRender,
  getCoreRowModel,
  type RowData,
  useReactTable,
} from "@tanstack/react-table";
import { type Column, type Row } from "@prisma/client";
import { z } from "zod";
import { useRows } from "~/hooks/useRows";
import { useColumns } from "~/hooks/useColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BaseTableCell } from "./base-table-cell";

type BaseTableProps = {
  rows: Row[];
  columns: Column[];
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData?: (
      rowId: string,
      columnId: string,
      value: string | number,
    ) => void;
  }
}

export const BaseTable = ({ rows, columns }: BaseTableProps) => {
  const [currentColumns, columnDispatch] = useColumns({ columns });

  // // Generate zod schema
  const schema = z.object(
    Object.fromEntries(
      currentColumns.map((column) => [
        column.id,
        column.type === "NUMBER" ? z.number() : z.string(),
      ]),
    ),
  );

  const columnDef = columns.map((column) => ({
    accessorKey: `rowData.${column.id}`,
    header: column.name,
    cell: BaseTableCell,
  }));

  const [currentRows, rowDispatch] = useRows({ rows });

  const table = useReactTable({
    data: currentRows,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowId: string, columnId: string, value: string | number) => {
        // Skip page index reset until after next rerender
        rowDispatch({
          type: "EDIT",
          payload: {
            rowId,
            columnId,
            value,
          },
        });
      },
    },
  });

  return (
    <div className="border">
      <Table className="w-1">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="bg-slate-100" />
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="border bg-slate-100">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <TableCell className="border bg-slate-100 p-2 font-semibold text-slate-400">
                  {index + 1}
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border p-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
