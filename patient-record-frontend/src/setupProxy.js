const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://patient-record-app-production.up.railway.app",
      // target: "http://localhost:4000",

      changeOrigin: true,
    })
  );
};
