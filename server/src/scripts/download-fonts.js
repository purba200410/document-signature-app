import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fonts = {
  "Pacifico-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/pacifico/Pacifico-Regular.ttf",
  "DancingScript-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf",
  "GreatVibes-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf",
  "Satisfy-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/satisfy/Satisfy-Regular.ttf"
};

const targetDir = path.join(__dirname, "..", "assets", "fonts");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  for (const [filename, url] of Object.entries(fonts)) {
    const dest = path.join(targetDir, filename);
    console.log(`Downloading ${filename} from ${url}...`);
    try {
      await download(url, dest);
      console.log(`Downloaded ${filename} successfully.`);
    } catch (err) {
      console.error(`Failed to download ${filename}:`, err);
    }
  }
}

main();
