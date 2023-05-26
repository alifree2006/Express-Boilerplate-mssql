// var fs = require("fs");
// export default async function createDir(dir: string) {
//   var dir = "./tmp/but/then/nested";

//   if (!(await fs.existsSync(dir))) {
//     await fs.mkdirSync(dir, { recursive: true });
//   }
// }

import fs from "fs";
import path from "path";

export default async function createDir(pathname: string) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ""); // Remove leading directory markers, and remove ending /file-name.extension
  await fs.mkdirSync(path.resolve(__dirname, pathname), { recursive: true });
}
