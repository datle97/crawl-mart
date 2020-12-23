const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  group: String,
  title: String,
  code: { type: String, unique: true, required: true },
  images: [String],
  description: String,
  price: Number,
  detail: String,
});

const VanPhongPham = mongoose.model("VanPhongPham", ProductSchema);
const ThucPhamKho = mongoose.model("ThucPhamKho", ProductSchema);
const SuaVaDoUong = mongoose.model("SuaVaDoUong", ProductSchema);
const GiaViVaPhuLieuNauAn = mongoose.model(
  "GiaViVaPhuLieuNauAn",
  ProductSchema
);
const NhaCuaVaGiaDung = mongoose.model("NhaCuaVaGiaDung", ProductSchema);
const MeVaBe = mongoose.model("MeVaBe", ProductSchema);
const DoChoiTreEm = mongoose.model("DoChoiTreEm", ProductSchema);

const Products = {
  VanPhongPham,
  ThucPhamKho,
  SuaVaDoUong,
  GiaViVaPhuLieuNauAn,
  NhaCuaVaGiaDung,
  MeVaBe,
  DoChoiTreEm,
};

module.exports = Products;
