const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = "https://www.zenmart.vn";
  const productUrls = [
    { title: "Van Phong Pham", url: "/vi/san-pham/van-phong-pham" },
    { title: "Thuc Pham Kho", url: "/vi/san-pham/thuc-pham-kho" },
    { title: "Sua & Do Uong", url: "/vi/san-pham/sua-do-uong" },
    {
      title: "Gia Vi & Phu Lieu Nau An",
      url: "/vi/san-pham/gia-vi-phu-lieu-nau-an",
    },
    { title: "Nha Cua & Gia Dung", url: "/vi/san-pham/nha-cua-gia-dung" },
    { title: "Me & Be", url: "/vi/san-pham/me-be" },
    { title: "Do Choi Tre Em", url: "/vi/san-pham/do-choi-tre-em" },
  ];

  for (let i = 0; i < productUrls.length; i++) {
    await page.goto(url + productUrls[i].url + "/page/1/");
    // button Last Page
    const lastPage = await page.evaluate(() =>
      document.querySelector("li a.last").getAttribute("href")
    );

    // lấy số page trên location pathname
    const regexPage = /(?<=page\/)(\d*)(?=\/)/;
    // lấy tổng số page
    const totalPage = lastPage.match(regexPage) && lastPage.match(regexPage)[0];

    // crawl từ page 1 đến last page
    for (let curPage = 1; curPage <= totalPage; curPage++) {
      await page.goto(url + productUrls[i].url + `/page/${curPage}/`);

      const productLinks = await page.evaluate(
        (url, i, curPage, productUrls) => {
          // thẻ a của tất cả sản phẩm trong 1 page
          const items = document.querySelectorAll(
            ".list-item .item-w figure a"
          );

          // thông tin của 1 page
          const info = {
            title: productUrls[i].title,
            page: curPage,
            links: [],
          };
          items.forEach((item, index) => {
            info.links.push({
              order: index + 1,
              url: url + item.getAttribute("href"),
            });
          });
          return info;
        },
        url,
        i,
        curPage,
        productUrls
      );

      // đọc file links
      const fileData = fs.readFileSync("data/links.json");

      // nếu file không có dữ liệu
      if (fileData.length === 0) {
        // ghi dữ liệu mới theo kiểu array
        fs.writeFileSync("data/links.json", JSON.stringify([productLinks]));
      } else {
        // nếu đã có dữ liệu
        // push data vào array đã có
        var parseFileData = JSON.parse(fileData);
        parseFileData.push(productLinks);
        fs.writeFileSync("data/links.json", JSON.stringify(parseFileData));
      }
    }
  }

  // mod dữ liệu vừa crawl theo title
  const modifiedData = parseFileData.reduce((acc, cur) => {
    const index = acc.findIndex((item) => item.title === cur.title);
    if (index === -1) {
      acc.push({
        title: cur.title,
        data: [{ page: cur.page, links: [cur.links] }],
      });
    } else {
      acc[index].data.push({ page: cur.page, links: cur.links });
    }
    return acc;
  }, []);

  fs.writeFileSync("data/modifiedLinks.json", JSON.stringify(modifiedData));

  // for (let vanPhongPham of productLinks) {
  //   await page.goto(vanPhongPham.url);
  //   const info = await page.evaluate(() => {
  //     const items = document.querySelectorAll(
  //       "div.product-thumb-w.gallery-thumb a"
  //     );
  //     const images = [];
  //     items.forEach((item) => {
  //       images.push("https://www.zenmart.vn" + item.getAttribute("href"));
  //     });

  //     const title = document.querySelector("h1.product-title").innerText;
  //     const code = document.querySelector("span.product-code span").innerText;
  //     const description = document.querySelector(
  //       "div.product-description.editor-ct"
  //     ).innerText;
  //     const price = document.querySelector("div.price-box span.price")
  //       .innerText;

  //     const detail = document.querySelector(
  //       ".pd-t-xs-3.pd-l-xs-3.pd-r-xs-3.editor-ct"
  //     ).innerHTML;
  //     return { title, code, images, description, price, detail };
  //   });
  //   // console.log(info);
  // }

  await browser.close();
})();