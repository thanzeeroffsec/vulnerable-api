const express = require("express");
const {
  userRoleUpdate,
  showLogs,
} = require("../../../controller/v1/admin/adminController");

const router = express.Router();

router.put("/user/email", userRoleUpdate);
router.get("/logs", showLogs);

module.exports = router;
