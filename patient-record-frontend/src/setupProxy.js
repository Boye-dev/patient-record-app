const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://patient-record-app-production.up.railway.app",
      // target: "https://babcock-exeat-production.up.railway.app",

      changeOrigin: true,
    })
  );
};
