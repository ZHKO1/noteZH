/**
 * Created by zhenghao on 16/2/9.
 */
var express = require('express');
var router = express.Router();
var api = require('../bin/sql.js');
var util = require('util');

/* GET users listing. */
router.post('/add', function(req, res, next) {
  var data  = req.body;
  if(api.addNote(data)){
    console.log("添加成功");
    res.status = 500;
    res.end(JSON.stringify({status:"ok"}));
  }else{
    console.log("添加失败");
    res.status = 500;
    res.end(JSON.stringify({status: "数据库添加错误"}));
  }

});

router.get('/list', function(req, res, next) {
  api.findAllNote();
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
