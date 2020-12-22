const fs = require("fs");

const filterProducts = () => {
  if (!fs.existsSync("data/filterProducts")) {
    fs.mkdirSync("data/filterProducts");
  }

  const products = fs.readdirSync("./data/products");

  for (let i = 0; i < products.length; i++) {
    const product = JSON.parse(fs.readFileSync(`data/products/${products[i]}`));
    // lọc các sản phẩm có code trùng nhau
    const modifiedProduct = product.filter(
      (item, index, array) =>
        array.map((mapItem) => mapItem["code"]).indexOf(item["code"]) === index
    );
    fs.writeFileSync(
      `data/filterProducts/${products[i]}`,
      JSON.stringify(modifiedProduct)
    );
  }

  // đổi tên file
  products.forEach((product) =>
    fs.rename(
      "data/filterProducts/" + product,
      "data/filterProducts/" + product.replace(/&/g, "Va"),
      (err) => console.log(err)
    )
  );
};

module.exports = filterProducts;
