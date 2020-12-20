const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const modifiedLinks = JSON.parse(fs.readFileSync("data/modifiedLinks.json"));
  for (let i = 0; i < modifiedLinks.length; i++) {
    for (let j = 0; j < modifiedLinks[i].data.length; j++) {
      console.log(modifiedLinks[i].data);
      await page.goto(modifiedLinks[i].data.links[j].url);

      const info = await page.evaluate(() => {
        const items = document.querySelectorAll(
          "div.product-thumb-w.gallery-thumb a"
        );
        const images = [];
        items.forEach((item) => {
          images.push("https://www.zenmart.vn" + item.getAttribute("href"));
        });

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

      fs.writeFileSync("data/info.json", JSON.stringify(info));
    }
  }

  await browser.close();
})();
