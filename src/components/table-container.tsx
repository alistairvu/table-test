import { api } from "~/trpc/server";

export default async function TableContainer() {
  const baseTables = await api.base.getTables();

  return <pre>{JSON.stringify(baseTables, null, 2)}</pre>;
}
