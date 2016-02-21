/**
 * Created by zhenghao on 16/2/9.
 */
var express = require('express');
var router = express.Router();
var api = require('../bin/sql.js');
var util = require('util');

/* GET listing. */
router.post('/add', function(req, res, next) {
  var data  = req.body;
  api.addNote(data,{
    failed:function(){
      console.log("添加失败");
      res.writeHead(500, {'Content-Type': 'application/json;charset=utf-8'});
      res.end(JSON.stringify({status: "数据库添加错误"}));
    },
    success:function(){
      console.log("添加成功");
      res.status = 200;
      res.end(JSON.stringify({status:"ok"}));
    }
  })
});

router.get('/list', function(req, res, next) {
  var result = {};
  if(req.query.date){
    api.findNoteByDate(req.query.date, function(results){
      res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
      result.status = "ok";
      result.result = results;
      res.end(JSON.stringify(result));
    });
  }else if(req.query.tag){
    api.findNoteByTag(req.query.tag, function(results){
      res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
      result.status = "ok";
      result.result = results;
      res.end(JSON.stringify(result));
    });
  }else{
    api.findAllNote(-1, function(results){
      res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
      result.status = "ok";
      result.result = results;
      res.end(JSON.stringify(result));
    });
  }
});

router.get('/calender', function(req, res, next) {
  var result = {};
  api.findCalender(function(results){
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    result.status = "ok";
    result.result = results;
    res.end(JSON.stringify(result));
  });
});

router.delete('/note', function(req, res, next) {
  var result = {};
  if(req.query){
    var id = req.query.id;
    api.deleteNote(id, {
      failed: function () {
        var status = 404;
        res.status(status).end();
      },
      success: function () {
        res.status = 202;
        result.status = "ok";
        res.end(JSON.stringify(result));
      },
    })
  }else{
    res.sendStatus(404)
    result.status = "not found";
    res.end(JSON.stringify(result));
  }
});

router.post('/note', function(req, res, next) {
  var data  = req.body;
  if(req.query.id){
    var id = req.query.id;
    api.updateNote(id, data, {
      failed:function(){
        res.writeHead(404, {'Content-Type': 'application/json;charset=utf-8'});
        var status = 404;
        res.status(status).end(JSON.stringify({status: "修改错误"}));
      },
      success:function(){
        res.status(200);
        res.end(JSON.stringify({status:"ok"}));
      }
    });
  }else{
    res.sendStatus(404)
    result.status = "not found";
    res.end(JSON.stringify(result));
  }
});

module.exports = router;