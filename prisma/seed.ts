// Generate a base and 100_000 data points
import { PrismaClient, ColumnType } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  // Create base
  console.log("Creating base");
  const base = await prisma.base.create({
    data: {
      name: "Testing Base",
    },
  });

  // Create table with columns
  console.log("Generating columns");
  const table = await prisma.table.create({
    data: {
      baseId: base.id,
      name: `Table 1`,

      columns: {
        create: [
          { name: "Name", type: ColumnType.TEXT, index: 0 },
          {
            name: "Age",
            type: ColumnType.NUMBER,
            index: 1,
          },
        ],
      },

      index: 0,
    },
    include: {
      columns: true,
    },
  });

  const columns = table.columns;
  const nameId = columns.find((x) => x.name === "Name")?.id;
  const ageId = columns.find((x) => x.name === "Age")?.id;

  // Generate the 100k rows
  const limit = 100000;
  console.log("Generating data...");
  const data = Array.from(Array(limit).keys()).map((_, index) => ({
    tableId: table.id,
    index,
  }));

  // Adding the 100k rows
  const rows = await prisma.row.createManyAndReturn({
    data,
  });
  console.log(`Added ${limit} rows`);

  const rowIds = rows.map((x) => x.id);

  const nameColumns = rowIds.map((rowId) => ({
    columnId: `${nameId}`,
    rowId,
    textValue: faker.person.fullName(),
  }));

  const ageColumns = rowIds
    .map((rowId) => ({
      rowId,
      age: Math.round(Math.random() * 100),
    }))
    .map(({ rowId, age }) => ({
      columnId: `${ageId}`,
      rowId,
      intValue: age,
      textValue: `${age}`,
    }));

  await prisma.cell.createMany({
    data: [...nameColumns, ...ageColumns],
  });
  console.log(`Filled ${limit} rows`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
