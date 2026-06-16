import app from "./app.ts";
import { env } from "./config/env.ts";
import { initDB } from "./services/file.service.ts";

async function startServer() {
  app.listen(env.SERVER_PORT, async () => {
    await initDB();
    console.log(`Server running on http://localhost:${env.SERVER_PORT}`);
  });
}

startServer();
