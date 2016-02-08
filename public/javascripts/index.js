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
cal.init({
  itemSelector: "#calendar",
  domain: "year",
  subDomain: "day",
  cellSize: 11.5,
  range: 1,
  displayLegend: false,
  start: new Date(),
  tooltip: true
});
