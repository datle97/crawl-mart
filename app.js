// dữ liệu crawl được lưu ở ./data/filterProducts.js
const getLinks = require("./crawl/getLinks");
const modifiedLinks = require("./utils/modifiedLinks");
const getProducts = require("./crawl/getProducts");
const filterProducts = require("./utils/filterProducts");

(async () => {
  await getLinks();
  modifiedLinks();
  await getProducts();
  filterProducts();
})();
