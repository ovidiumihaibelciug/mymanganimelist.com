// server.js
const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);
var favicon = require("serve-favicon");
var path = require("path");

// With express
const express = require("express");

app.prepare().then(() => {
  express()
    .use(favicon(path.join(__dirname, "static", "favicon.ico")))
    .use(handler)
    .listen(3000);
});
