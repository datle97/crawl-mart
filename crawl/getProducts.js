const puppeteer = require("puppeteer");
const fs = require("fs");

const getProducts = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // tạo folder ./data/products nếu chưa tồn tại
  if (!fs.existsSync("data/products")) {
    fs.mkdirSync("data/products");
  }

  const modifiedLinks = JSON.parse(fs.readFileSync("data/modifiedLinks.json"));
  for (let i = 0; i < modifiedLinks.length; i++) {
    const result = [];
    // crawl dữ liệu của từng sản phẩm
    for (let j = 0; j < modifiedLinks[i].data.length; j++) {
      await page.goto(modifiedLinks[i].data[j].url);
      const info = await page.evaluate(() => {
        const product = {
          group: document.querySelector("h3.product-subtitle").innerText,
          title: document.querySelector("h1.product-title").innerText,
          code: document.querySelector("span.product-code span").innerText,
          images: [
            ...document.querySelectorAll("div.product-thumb-w.gallery-thumb a"),
          ].map((item) => "https://www.zenmart.vn" + item.getAttribute("href")),
          description: document.querySelector(
            "div.product-description.editor-ct"
          ).innerText,
          price: document.querySelector("div.price-box span.price").innerText,
          detail: document.querySelector(
            ".pd-t-xs-3.pd-l-xs-3.pd-r-xs-3.editor-ct"
          ).innerHTML,
        };
        return product;
      });

      result.push(info);
    }
    const fileName = modifiedLinks[i].title.replace(/\s+/g, "");
    fs.writeFileSync(`data/products/${fileName}.json`, JSON.stringify(result));
  }

  await browser.close();
};

module.exports = getProducts;
