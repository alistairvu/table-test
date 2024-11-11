import { api, HydrateClient } from "~/trpc/server";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const base = await api.base.get();

  return (
    <HydrateClient>
      <main>
        <header className="sticky top-0 z-20 bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold"> {base.name}</h1>
        </header>

        {children}
      </main>
    </HydrateClient>
  );
}
