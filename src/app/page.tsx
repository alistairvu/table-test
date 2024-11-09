import { api } from "~/trpc/server";
import { notFound, redirect } from "next/navigation";

export default async function Home() {
  const base = await api.base.get();
  const firstTable = base.tables[0];

  if (!firstTable) {
    notFound();
  }

  redirect(firstTable.id);
}
