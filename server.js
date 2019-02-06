// const express = require("express");
// const next = require("next");
//
// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();
//
// app
//   .prepare()
//   .then(() => {
//     const server = express();
//
//     server.get("/anime/category/:category", (req, res) => {
//       const actualPage = "/anime/category";
//       const queryParams = { category: req.params.category };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/anime/list/:type", (req, res) => {
//       const actualPage = "/anime/list";
//       const queryParams = { type: req.params.type };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/anime/:slug", (req, res) => {
//       const actualPage = "/anime";
//       const queryParams = { slug: req.params.slug };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/manga/view/:slug", (req, res) => {
//       const actualPage = "/manga/view";
//       const queryParams = { slug: req.params.slug };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/manga/category/:category", (req, res) => {
//       const actualPage = "/manga/category";
//       const queryParams = { category: req.params.category };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/manga/list/:type", (req, res) => {
//       const actualPage = "/manga/list";
//       const queryParams = { type: req.params.type };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/episode/:slug/:number", (req, res) => {
//       const actualPage = "/episode";
//       const queryParams = { slug: req.params.slug, number: req.params.number };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("/episodes/list/:slug", (req, res) => {
//       const actualPage = "/episodes/list";
//       const queryParams = { slug: req.params.slug };
//       app.render(req, res, actualPage, queryParams);
//     });
//
//     server.get("*", (req, res) => {
//       return handle(req, res);
//     });
//
//     server.listen(3000, err => {
//       if (err) throw err;
//       console.log("> Ready on http://localhost:3000");
//     });
//   })
//   .catch(ex => {
//     console.error(ex.stack);
//     process.exit(1);
//   });

// server.js
const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);

// With express
const express = require("express");
app.prepare().then(() => {
  express()
    .use(handler)
    .listen(3000);
});
