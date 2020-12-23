// dữ liệu crawl được lưu ở ./data/modifiedProducts.json
const getLinks = require("./crawl/getLinks");
const modifiedLinks = require("./utils/modifiedLinks");
const getProducts = require("./crawl/getProducts");
const modifiedProducts = require("./utils/modifiedProducts");

// nodemon app.js
(async () => {
  await getLinks();
  modifiedLinks();
  await getProducts();
  modifiedProducts();
})();
