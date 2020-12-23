// chạy app.js trước khi dùng

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Products = require("./models/Product");
const fs = require("fs");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.post("/postall", (req, res) => {
  const data = fs.readdirSync("./data/modifiedProducts");
  const keys = data.map((item) => item.slice(0, -5));
  for (let i = 0; i < data.length; i++) {
    const fileData = JSON.parse(
      fs.readFileSync(`data/modifiedProducts/${data[i]}`)
    );
    for (let j = 0; j < fileData.length; j++) {
      const newProduct = new Products[keys[i]](fileData[j]);
      newProduct
        .save()
        .then((product) => {
          console.log("success");
        })
        .catch((err) => {
          console.log("err");
        });
    }
  }
});

app.post("/deleteall", (req, res) => {
  const keys = Object.keys(Products);
  for (let i = 0; i < keys.length; i++) {
    Products[keys[i]].deleteMany({}, (err) => {});
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
