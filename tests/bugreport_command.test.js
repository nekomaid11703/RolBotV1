const servicePath = require.resolve("../src/services/bugReportService");
const commandPath = require.resolve("../src/commands/info/bugreport");
const previousService = require.cache[servicePath];
const createReport = vi.fn();

require.cache[servicePath] = {
  id: servicePath,
  filename: servicePath,
  loaded: true,
  exports: { createReport },
};
delete require.cache[commandPath];
const bugreport = require(commandPath);

afterAll(() => {
  delete require.cache[commandPath];
  if (previousService) require.cache[servicePath] = previousService;
  else delete require.cache[servicePath];
});

it("reserva el cooldown antes de descargar para bloquear reportes concurrentes", async () => {
  let finishReport;
  createReport.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishReport = resolve;
      }),
  );
  const baseContext = {
    args: ["fallo", "concurrente"],
    sender: "concurrent-user@s.whatsapp.net",
    userName: "Tester",
    isGroup: false,
    from: "concurrent-user@s.whatsapp.net",
    sock: {},
    msg: { message: { conversation: "/bugreport fallo concurrente" } },
  };
  const firstReply = vi.fn();
  const secondReply = vi.fn();

  const first = bugreport.execute({ ...baseContext, reply: firstReply });
  await vi.waitFor(() => expect(createReport).toHaveBeenCalledOnce());
  await bugreport.execute({ ...baseContext, reply: secondReply });

  expect(createReport).toHaveBeenCalledOnce();
  expect(secondReply).toHaveBeenCalledWith(expect.stringContaining("Puedes reportar otro bug"));

  finishReport({ id: "12345678-0000-4000-8000-000000000000", category: "other", priority: "low", status: "open" });
  await first;
  expect(firstReply).toHaveBeenCalledOnce();
});
