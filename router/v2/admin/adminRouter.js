const express = require("express");
const { userDetails } = require("../../../controller/v2/admin/adminController");

const router = express.Router();

router.get("/user/:id", userDetails);

module.exports = router;
