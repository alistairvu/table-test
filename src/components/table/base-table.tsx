"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowData,
  useReactTable,
} from "@tanstack/react-table";
import { type Column } from "@prisma/client";
import { type RowWithCells } from "~/@types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BaseTableCell } from "./base-table-cell";
import { api } from "~/trpc/react";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

type BaseTableProps = {
  tableId: string;
  initialColumns: Column[];
  initialRows: RowWithCells[];
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData?: (
      rowId: string,
      columnId: string,
      value: string | number,
    ) => void;

    isNumber?: (columnId: string) => boolean;
  }
}

export const BaseTable = ({
  tableId,
  initialColumns,
  initialRows,
}: BaseTableProps) => {
  // Query client
  const queryClient = useQueryClient();

  // Loading in data
  const { data: columns } = api.table.getColumns.useQuery(tableId, {
    initialData: initialColumns,
  });

  const { data: rows } = api.table.getRows.useQuery(tableId, {
    initialData: initialRows,
  });

  // SECTION: Mutations for editing a text cell
  const editTextCell = api.table.editTextCell.useMutation({
    onSettled: async () => {
      const queryKey = getQueryKey(api.table.getRows, tableId, "any");
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  // SECTION: Mutations for editing a text cell
  const editIntCell = api.table.editIntCell.useMutation({
    onSettled: async () => {
      const queryKey = getQueryKey(api.table.getRows, tableId, "any");
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  // Column definitions
  const columnDef: ColumnDef<RowWithCells, string | number>[] = columns.map(
    (column) => ({
      id: column.id,
      accessorFn: (row: RowWithCells) => {
        const cell = row.cells.find((cell) => cell.columnId === column.id);

        if (column.type === "NUMBER" && cell?.intValue) {
          return cell?.intValue;
        }

        return `${cell?.textValue}`;
      },
      header: column.name,
      cell: BaseTableCell,
    }),
  );

  // Actual table hook
  const table = useReactTable({
    data: rows,
    columns: columnDef,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",

    getRowId: (originalRow, _index, _parent) => {
      return originalRow.id;
    },

    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowId: string, columnId: string, value: string | number) => {
        const isNumber =
          columns.find((col) => col.id === columnId)?.type === "NUMBER";
        const matchingRow = rows.find((row) => row.id === rowId);

        if (!matchingRow) {
          return;
        }

        const matchingCell = matchingRow.cells.find(
          (cell) => cell.columnId === columnId,
        );
        if (!matchingCell) {
          return;
        }

        const cellId = matchingCell.id;

        if (isNumber) {
          editIntCell.mutate({
            value: parseInt(`${value}`),
            cellId,
          });
        } else {
          editTextCell.mutate({ value: `${value}`, cellId });
        }
      },

      isNumber: (columnId: string) => {
        return columns.find((col) => col.id === columnId)?.type === "NUMBER";
      },
    },
  });

  // Setting up for virtualizer
  const { rows: tableRows } = table.getRowModel();

  const tableContainerRef = useRef<HTMLTableElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    estimateSize: () => 50,
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <div className="border">
      <Table
        style={{ width: table.getTotalSize() * 2 }}
        ref={tableContainerRef}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="w-4 bg-slate-100" />
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="border bg-slate-100"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className="absolute right-0 top-0 h-full w-1 bg-slate-600 opacity-0"
                    />
                  </TableHead>
                );
              })}
              <TableHead className="w-4 bg-slate-100">+</TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
          }}
        >
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
                  <TableCell key={cell.id} className="border py-0">
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
