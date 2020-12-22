const fs = require("fs");

const modifiedLinks = () => {
  const fileData = JSON.parse(fs.readFileSync("data/links.json"));

  // mod dữ liệu vừa crawl theo title (chỉ lấy url)
  const modifiedData = fileData.reduce((acc, cur) => {
    const index = acc.findIndex((item) => item.title === cur.title);
    const links = cur.links.map((link) => ({ url: link.url }));
    if (index === -1) {
      acc.push({
        title: cur.title,
        data: [...links],
      });
    } else {
      acc[index].data.push(...links);
    }
    return acc;
  }, []);

  fs.writeFileSync("data/modifiedLinks.json", JSON.stringify(modifiedData));
};

module.exports = modifiedLinks;
