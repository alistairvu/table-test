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

  const rows = await api.table.getRows(tableId);

  return (
    <div className="p-2">
      <BaseTable columns={columns} rows={rows} />
    </div>
  );
}
