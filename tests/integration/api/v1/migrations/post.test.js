import database from "infra/database.js";

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

beforeEach(async () => {
  await cleanDatabase();
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);
  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);

  const migrationsTable = await database.query(
    "select exists(select 1 from pgmigrations);",
  );
  expect(migrationsTable.rows[0].exists).toBe(true);

  const executedMigrations = await database.query(
    "select * from pgmigrations;",
  );
  expect(executedMigrations.rows.length).toBeGreaterThan(0);
  expect(executedMigrations.rows[0].name).toContain("first-migration-test");
});

test("POST should be idempotent - running twice should not create duplicates", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const body1 = await response1.json();

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const body2 = await response2.json();

  const migrationsInDb = await database.query(
    "SELECT * FROM pgmigrations ORDER BY id",
  );
  expect(body2.length).toBe(0);
  expect(body1.length).toBe(migrationsInDb.rows.length);
});
