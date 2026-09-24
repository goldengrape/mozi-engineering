const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

function contentType(filePath) {
  const ext = path.extname(filePath);
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  }[ext] || "application/octet-stream";
}

function createStaticServer(rootDir = path.resolve("dist")) {
  const absoluteRoot = path.resolve(rootDir);

  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    let relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");

    if (!relativePath || relativePath.endsWith("/")) {
      relativePath += "index.html";
    }

    const filePath = path.resolve(absoluteRoot, relativePath);
    if (
      filePath !== absoluteRoot &&
      !filePath.startsWith(absoluteRoot + path.sep)
    ) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(response);
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4173);
  const server = createStaticServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Serving dist/ at http://127.0.0.1:${port}/`);
  });
}

module.exports = { createStaticServer };
