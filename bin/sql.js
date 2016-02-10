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


var api = {};
//添加一条新的数据
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
        console.log("回调failed");
        options.failed();
        return;
      }
    }else{
      if(options.success)
        options.success();
    }
  })
}

api.deleteTag = function(){

}
//查找制定日期的notes
api.findDate = function(date){
  var result = false;
  noteModel.find({date: date}, function(err,notes){
    if(err) return console.error(err);
    console.dir(notes);
  });
}

//查找所有notes
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



module.exports = api;

