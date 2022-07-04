const router = require("express").Router();
const SplitMiddleWare = require('../middlewares/split.middleware')
const splitController = require('../controllers/split.controller')


router.post("/compute", SplitMiddleWare.orderSplit, SplitMiddleWare.splitFlat, SplitMiddleWare.splitPercentage, SplitMiddleWare.splitRatio, splitController);

module.exports = router