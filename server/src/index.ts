import app from "./app.ts";
import { env } from "./config/env.ts";
import { initDB } from "./utils/index.ts";

async function startServer() {
  await initDB();
  app.listen(env.SERVER_PORT, async () => {
    await initDB();
    console.log(`Server running on http://localhost:${env.SERVER_PORT}`);
  });
}

startServer();
