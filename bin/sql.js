var mongoose = require('mongoose'),
  db = 'mongodb://localhost:27017/noteZH';
// 数据库连接
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
  date: Date,
  number: Number
});
var DateModel = mongoose.model('date', DateSchema);
var Date_api = {
  addDate :function(dateIN){
    var date = new Date();
    date.setYear(dateIN.getYear());
    date.setMonth(dateIN.getMonth());
    date.setDate(dateIN.getDate());
    var dateData = new DateModel({
      date: date,
      number:1
    });
    dateData.save(function(err){
      if(err) console.dir(err);
      result = false;
      return result;
    });
  },
  listDate:function(callback){
    var results = [];
    DateModel.find({}, function(err,dates){
      if(err) return console.error(err);
      dates.map(function(date){
        results.push(date.toJSON());
      });
      callback(results);
    });
  },
  updateDate:function(dateIN, dir){
    var that = this;
    var date = new Date();
    date.setYear(dateIN.getYear());
    date.setMonth(dateIN.getMonth());
    date.setDate(dateIN.getDate());

    DateModel.update({date:date}, {}, function(err){
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
}



var api = {};
api.addNote = function(data){
  var result = true;
  console.log(data)
  var content = data.content;
  var date = data.date?data.date:new Date();
  var tags = data.tags?JSON.parse(data.tags):[];
  console.log(tags);
  var noteData = new noteModel({
    content: content,
    date: date,
    tags:tags,
  });
  noteData.save(function(err){
    if(err) console.dir(err);
    result = false;
    return result;
  });
  console.dir(noteData._doc);
  return result;
};
api.deleteNote = function(_id, options){
  noteModel.where().findOneAndRemove({_id:_id}, function(err){
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
  })
}
api.findAllNote = function(callback){
  var results = [];
  noteModel.find({}, function(err,notes){
    if(err) return console.error(err);
    notes.map(function(note){
      results.push(note.toJSON());
    });
    callback(results);
  });
}
api.updateNote = function(id, data, options){
  var tags = data.tags?JSON.parse(data.tags):[];
  data.tags = tags;
  noteModel.update(id, data, function(err){
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

api.findNoteByTag = function(tag, callback){
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

//todo 获取所有date的数据，用在日历组建上
//todo 查找所有tags的数量数据

module.exports = api;

