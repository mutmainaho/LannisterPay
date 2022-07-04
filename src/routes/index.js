const router = require("express").Router();


router.use("/split-payments", require("./split.routes"));

module.exports = router