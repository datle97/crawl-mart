const fs = require("fs");

const modifiedProducts = () => {
  if (!fs.existsSync("data/modifiedProducts")) {
    fs.mkdirSync("data/modifiedProducts");
  }

  const products = fs.readdirSync("./data/products");

  for (let i = 0; i < products.length; i++) {
    const product = JSON.parse(fs.readFileSync(`data/products/${products[i]}`));

    const modifiedProduct = product
      // lọc các sản phẩm có code trùng nhau
      .filter(
        (item, index, array) =>
          array.map((mapItem) => mapItem["code"]).indexOf(item["code"]) ===
          index
      )
      // chuyển price String => Number
      .map((item) => ({
        ...item,
        price: parseInt(item.price.replace(/\./g, "")),
      }));
    fs.writeFileSync(
      `data/modifiedProducts/${products[i]}`,
      JSON.stringify(modifiedProduct)
    );
  }

  // đổi tên file
  products.forEach((product) =>
    fs.rename(
      "data/modifiedProducts/" + product,
      "data/modifiedProducts/" + product.replace(/&/g, "Va"),
      (err) => console.log(err)
    )
  );
};

module.exports = modifiedProducts;
