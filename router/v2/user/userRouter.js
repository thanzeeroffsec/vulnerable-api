const express = require("express");
const {
  userCart,
  userTemplate,
  addToCart,
} = require("../../../controller/v2/user/userController");
const {
  webHookUrk,
  getAllProducts,
  getSingleProdcut,
} = require("../../../controller/v2/admin/adminController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to API V2");
});

router.get("/cart", userCart);
router.post("/print", userTemplate);
router.post("/cart/add", addToCart);

router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProdcut);
router.post("/webhook/validate", webHookUrk);

module.exports = router;
