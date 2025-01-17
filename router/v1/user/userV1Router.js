const express = require("express");
const {
  userDetail,
  userLogin,
} = require("../../../controller/v1/user/userController");

const router = express.Router();

router.get("/:id", userDetail);
router.post("/login", userLogin);

module.exports = router;
