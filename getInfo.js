const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const modifiedLinks = JSON.parse(fs.readFileSync("data/modifiedLinks.json"));
  for (let i = 0; i < modifiedLinks.length; i++) {
    const fileName = modifiedLinks[i].title.replace(/\s+/g, "");

    // tạo folder ./data/products trước đọc file json
    if (!fs.existsSync("data/products")) {
      fs.mkdirSync("data/products");
    }
    // tạo file json trước khi đọc dữ liệu
    if (!fs.existsSync(`data/products/${fileName}.json`)) {
      fs.writeFileSync(`data/products/${fileName}.json`, "");
    }
    const fileData = fs.readFileSync(`data/products/${fileName}.json`);

    // tránh lỗi type Buffer khi ghi đè dữ liệu
    const result = fileData.length === 0 ? [...fileData] : JSON.parse(fileData);

    // crawl dữ liệu của từng sản phẩm
    for (let j = 0; j < modifiedLinks[i].data.length; j++) {
      await page.goto(modifiedLinks[i].data[j].url);
      const info = await page.evaluate(() => {
        // url các ảnh
        const items = document.querySelectorAll(
          "div.product-thumb-w.gallery-thumb a"
        );
        const images = [];
        items.forEach((item) => {
          images.push("https://www.zenmart.vn" + item.getAttribute("href"));
        });
        // các thông tin khác
        const title = document.querySelector("h1.product-title").innerText;
        const code = document.querySelector("span.product-code span").innerText;
        const description = document.querySelector(
          "div.product-description.editor-ct"
        ).innerText;
        const price = document.querySelector("div.price-box span.price")
          .innerText;
        const detail = document.querySelector(
          ".pd-t-xs-3.pd-l-xs-3.pd-r-xs-3.editor-ct"
        ).innerHTML;
        return { title, code, images, description, price, detail };
      });

      result.push(info);
    }

    fs.writeFileSync(`data/products/${fileName}.json`, JSON.stringify(result));
  }

  await browser.close();
})();
