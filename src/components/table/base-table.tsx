"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
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

type BaseTableProps = {
  rows: Row[];
  columns: Column[];
};

export const BaseTable = ({ rows, columns }: BaseTableProps) => {
  const [currentColumns, columnDispatch] = useColumns({ columns });

  // // Generate zod schema
  // const schema = z.object(
  //   Object.fromEntries(
  //     currentColumns.map((column) => [
  //       column.id,
  //       column.type === "NUMBER" ? z.number() : z.string(),
  //     ]),
  //   ),
  // );

  const columnDef = columns.map((column) => ({
    accessorKey: `rowData.${column.id}`,
    header: column.name,
  }));

  const [currentRows, rowDispatch] = useRows({ rows });

  const table = useReactTable({
    data: currentRows,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="bg-slate-500" />
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                <TableCell className="bg-slate-500">{index + 1}</TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
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
