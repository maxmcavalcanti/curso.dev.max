test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  // Checando o formado do dado de data
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  // Checando se a versão do POSTGRES está em um formato esperado de xx.xx(16.0)
  const versionRegex = /^\d+\.\d+$/;
  expect(responseBody.dependencies.database.version).toMatch(versionRegex);
  q;
  // Checando se podem ser transformados em números
  expect(!isNaN(responseBody.dependencies.database.max_connections)).toBe(true);
  expect(!isNaN(responseBody.dependencies.database.opened_connections)).toBe(
    true,
  );
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
});

// test.only("Teste de SQL Injections", async () => {
//   await fetch(
//     "http://localhost:3000/api/v1/status?databaseName='; SELECT pg_sleep(4) --",
//   );
// });
