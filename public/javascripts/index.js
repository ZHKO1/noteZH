/**
 * Created by zhenghao on 16/2/6.
 */

//Todo 规划好界面 模仿github的界面来尝试 可以在学习纪录功能 以及 PSN奖杯查看 界面切换
//Todo 熟悉了解日历插件的用法
//Todo 了解熟悉日历插件的写法，能尽力改善就改善就改善
//
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
