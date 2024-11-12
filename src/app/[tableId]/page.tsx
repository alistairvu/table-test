import { BaseTable } from "~/components/table/base-table";
import { api } from "~/trpc/server";

type PageProps = {
  tableId: string;
};

export default async function TablePage({
  params,
}: {
  params: Promise<PageProps>;
}) {
  const tableId = (await params).tableId;

  const columns = await api.table.getColumns(tableId);

  const { count: rowCount } = await api.table.countRows(tableId);

  return (
    <BaseTable tableId={tableId} initialColumns={columns} rowCount={rowCount} />
  );
}
