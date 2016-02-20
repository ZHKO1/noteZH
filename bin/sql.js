var mongoose = require('mongoose'),
  db = 'mongodb://localhost:27017/noteZH';
mongoose.connect(db);
mongoose.connection.on('connected', function(){
  console.log("开始链接");
});
mongoose.connection.on('error', function(err){
  console.log("发生错误")
  if(err){
    console.log(error)
  }
});
mongoose.connection.on('disconnected', function(){
  console.log("链接失败");
});

var Schema = mongoose.Schema;
var noteSchema = new Schema({
  content: String,
  date: Date,
  tags:[String]
});
var noteModel = mongoose.model('note', noteSchema);

var DateSchema = new Schema({
  date: String,
  number: Number
});
var DateModel = mongoose.model('date', DateSchema);
var Date_api = {
  isExistDate :function(timeString, options){
    var that = this;
    DateModel.findOne({date:timeString},function(err,date){
      if(err){
        console.error(err);
        if(options.failed){
          options.failed();
        }
      }else{
        if(date && options.success){
            options.success();
        }else if(!date && options.createCallback){
          options.createCallback();
        }else{}
      }
    });

  },
  addDate :function(timeString,options){
    var dateData = new DateModel({
      date: timeString,
      number:1
    });
    dateData.save(function(err){
      if(err && options.failed){
        options.failed();
      }
      if(!err && options.success){
        options.success();
      }

    });
  },
  listDate:function(callback){
    var results = {};
    DateModel.find({}, function(err,dates){
      if(err) return console.error(err);
      dates.map(function(date){
        var date = date.toJSON();
        date.date = new Date(date.date);
        date.date = Math.ceil(date.date.getTime()/1000);
        results[date.date] = date.number;
      });
      callback(results);
    });
  },
  updateDate:function(timeString, dir){
    var that = this;
    that.isExistDate(timeString, {
      failed:function(){
        console.log("查找错误");
      },
      success:function(){
        if(dir >= 0)
          DateModel.update({date: timeString},{'$inc':{'number':1} } ,function(err){});
        if(dir < 0)
          DateModel.findOneAndUpdate({date: timeString},{'$inc':{'number':-1} } ,function(err,doc){
            if(doc._doc.number == 1){
              doc.remove(function(err){
                if(err) return console.error(err);
              });
            }
          });
      },
      createCallback:function(){
        that.addDate(timeString, {
          failed:function(){},
          success:function(){}
        });
      }
    });
  }
}



var api = {};
api.addNote        = function(data,options){
  var result = true;
  var content = data.content;
  var date = data.date?data.date:new Date();
  var tags = data.tags?JSON.parse(data.tags):[];
  var noteData = new noteModel({
    content: content,
    date: date,
    tags:tags,
  });
  noteData.save(function(err){
    if(err){
      console.dir(err);
      if(options.failed){
        options.failed();
        return;
      }
    }else{
      console.dir(noteData._doc);
      var date = noteData._doc.date;
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;
      var date  = date.getDate();
      var timeString = year + "-" + month + "-" + date;
      console.log(timeString);
      Date_api.updateDate(timeString, 1);
      if(options.success)
        options.success();
    }
  });
};
api.deleteNote     = function(_id, options){
  noteModel.where().findOneAndRemove({_id:_id}, function(err, doc){
    if(err){
      console.error(err);
      if(options.failed){
        options.failed();
        return;
      }
    }else{
      var date = doc._doc.date;
      var year  = date.getYear() + 1900;
      var month = date.getMonth() + 1;
      var date  = date.getDate();
      var timeString = year + "-" + month + "-" + date;
      Date_api.updateDate(timeString, -1);
      if(options.success)
        options.success();
    }
  })
}
api.findAllNote    = function(callback){
  var results = [];
  noteModel.find({}, function(err,notes){
    if(err) return console.error(err);
    notes.map(function(note){
      results.push(note.toJSON());
    });
    callback(results);
  });
}
api.findCalender   = function(callback){
  Date_api.listDate(callback);
}
api.updateNote     = function(id, data, options){
  var tags = data.tags?JSON.parse(data.tags):[];
  data.tags = tags;
  delete data.date;
  noteModel.update({_id:id}, data, function(err){
    if(err){
      console.error(err);
      if(options.failed){
        options.failed();
        return;
      }
    }else{
      if(options.success)
        options.success();
    }
  });
}
api.findNoteByDate = function(dateIN, callback){
  var results = [];
  var dateIN = new Date(parseInt(dateIN,10));

  var dateForm = new Date();
  dateForm.setYear(dateIN.getYear() + 1900);
  dateForm.setMonth(dateIN.getMonth());
  dateForm.setDate(dateIN.getDate());
  dateForm.setHours(0);
  dateForm.setMinutes(0);

  var dateTo = new Date();
  dateTo.setYear(dateIN.getYear() + 1900);
  dateTo.setMonth(dateIN.getMonth());
  dateTo.setDate(dateIN.getDate() + 1);
  dateTo.setHours(0);
  dateTo.setMinutes(0);

  noteModel.find({
    date:{
    "$gte": dateForm,
    "$lt": dateTo
  }}, function(err,notes){
    if(err) return console.error(err);
    notes.map(function(note){
      results.push(note.toJSON());
    });
    console.log(results.length);
    callback(results);
  });
}
api.findNoteByTag  = function(tag, callback){
  var results = [];
  noteModel.find({
      tags:{$in: [tag]}
    }, function(err,notes){
    if(err) return console.error(err);
    notes.map(function(note){
      results.push(note.toJSON());
    });
    console.log(results.length);
    callback(results);
  });
}

//todo 继续完善功能 也就是最为基本的TODOlist功能
//布局
/*
  日历
  总共经验值 连击数

  tags 的各经验值
  默认显示 最近三个commit
  点击日期 按照日期来显示该日期所有的commit
*/

//todo 查找每个tag对应的notes数量 想法：经验值
//todo 修改tags 以及删除tags
//todo 引入测试机制，节省劳动力
//todo 研究resful机制，重新洗牌接口
//todo 思考ES6方式，重新洗牌
//todo 解决金字塔方式回调问题，重新洗牌
//todo 看书思考正规写法，重新洗牌
//todo (WARNING 前方高能) PSN奖杯的爬虫功能引入

module.exports = api;

