// import chokidar from "chokidar";
// import { DB_PATH } from "./file.service.ts";

// const watcher = chokidar.watch(DB_PATH, {
//   persistent: true,
//   ignoreInitial: false,
//   awaitWriteFinish: { stabilityThreshold: 300 },
// });

// const log = console.log.bind(console);

// watcher
//   .on("add", (path) => log(`File ${path}  has been added`))
//   .on("change", (path) => log(`File ${path} has been changed`))
//   .on("unlink", (path) => log(`File ${path} has been removed`));
