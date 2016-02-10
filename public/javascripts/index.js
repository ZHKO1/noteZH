/**
 * Created by zhenghao on 16/2/6.
 */

//Todo 规划好界面 模仿github的界面来尝试 可以在学习纪录功能 以及 PSN奖杯查看 界面切换
//Todo 熟悉了解日历插件的用法
//Todo 了解熟悉日历插件的写法，能尽力改善就改善就改善
//Todo 开始回头做技术积累准备
//Todo 数据库埋下伏笔 先思考如何保存数据，读取数据，查询数据 然后连调思考
//Todo express埋下伏笔，基本就是这框架了，思考如何能应用，连调所有的模块
var cal = new CalHeatMap();
var startDate = new Date();
var day = startDate.getDate()
startDate.setDate(day - 365);

var weekStart = new Date();
weekStart.setDate(weekStart.getDate() - weekStart.getDay());
var ranges = d3.range(+weekStart/1000, +weekStart/1000 + 3600*24*8, 3600*24);

var max = 5;
var min = 2;

var marcData = {};

// Creating a random data set
ranges.map(function(element, index, array) {
  console.log(element);
  marcData[element] = 11;
});

cal.init({
  itemSelector: "#calendar",
  domain: "year",
  subDomain: "day",
  cellSize: 11.5,
  range: 1,
  displayLegend: false,
  data: marcData,
  start: new Date(),
  tooltip: true,
  legend: [10, 20, 30, 40],
  onClick: function(date, nb) {
    console.log(date);
    console.log(nb);
  }
});
var api = {
  listAllNotes : function(){
    $.ajax({
      type: "GET",
      url: "/api/list",
      dataType: "json",
      success: function(data){
        console.log(data);

      }
    });
  },
  addNewNote : function(data){
    if((toString.apply(data.tags) === '[object Array]')&& (data.tags)){
      data.tags = JSON.stringify(data.tags);
    }
    $.ajax({
      type: "POST",
      url: "/api/add",
      dataType: "json",
      data:data,
      success: function(data){
        console.log(data);
      }
    });
  },
  deleteNote : function(_id){
    $.ajax({
      type: "delete",
      url: "/api/note?id=" + _id,
      dataType: "json",
      success: function(data){
        console.log(data);
      }
    });
  }
}
