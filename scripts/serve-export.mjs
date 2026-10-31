import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const base = "/infradash-codexend";
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname === "/" || url.pathname === base) {
        res.writeHead(302, { Location: base + "/" });
        res.end();
        return;
      }
      if (!url.pathname.startsWith(base + "/")) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const requested = decodeURIComponent(url.pathname.slice(base.length));
      let file = path.resolve(root, "." + requested);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      if ((await fs.stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const data = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        await fs.readFile(path.join(root, "404.html")).catch(() => "Not found"),
      );
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Static export: http://127.0.0.1:" + port + base + "/"),
  );
