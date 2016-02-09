/**
 * Created by zhenghao on 16/2/9.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/add', function(req, res, next) {
  console.log("add");
});

router.get('/list', function(req, res, next) {
  console.log("list");
  res.end(JSON.stringify({wow:123}));
});

router.get('/delete', function(req, res, next) {
  console.log("delete");
});

router.get('/update', function(req, res, next) {
  console.log("update");
});

module.exports = router;
