// import chokidar from "chokidar";
// import { DB_PATH, readJsonFile } from "./services/file.service.ts";
// import fs from "node:fs/promises";
// import path from "node:path";
// import type { Profile } from "./types/index.ts";

// async function upsert(profile: Profile) {
//   const all = [];
//   const tempPath = path.join(DB_PATH, "..", ".temp", "items.json");

//   try {
//     const raw = await fs.readFile(tempPath, "utf-8");
//     console.log(raw);
//     if (raw) { all.push(raw); }
//     all.push(profile);
//     await fs.writeFile(tempPath, JSON.stringify(all, null, 2), "utf-8");
//   } catch (err) {
//     // if (err.code === "ENOENT") {
//     //   console.log("write here");
//     //   await fs.writeFile(tempPath, JSON.stringify(profile, null, 2), "utf-8");
//     //   return;
//     // }
//   }
// }

// export function startWatcher() {
//   const watcher = chokidar.watch(DB_PATH, {
//     persistent: true,
//     ignoreInitial: false,
//     awaitWriteFinish: { stabilityThreshold: 300 },
//   });

//   const log = console.log.bind(console);

//   watcher
//     .on("add", async (path) => {
//       log(`File ${path} has been added`);

//       try {
//         const content = await readJsonFile(path);
//         await upsert(content);
//       } catch (err) {
//         console.error("❌", err);
//       }
//     })
//     .on("change", (path) => log(`File ${path} has been changed`))
//     .on("unlink", (path) => log(`File ${path} has been removed`));
// }
