/**
 * Created by zhenghao on 16/2/6.
 */

var api = {
  listCalender: function(){
    var result;
    $.ajax({
      type: "GET",
      async: false,
      url: "/api/calender",
      dataType: "json",
      success: function(data){
        result = data.result;
      }
    });
    return result;
  },
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
  listNotesByDate : function(date){
    $.ajax({
      type: "GET",
      url: "/api/list?date=" + date.getTime(),
      dataType: "json",
      success: function(data){
        console.log(data);
      }
    });
  },
  listNotesByTag : function(tag){
    $.ajax({
      type: "GET",
      url: "/api/list?tag=" + tag,
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
  },
  updateNote:function(id,data){
    if((toString.apply(data.tags) === '[object Array]')&& (data.tags)){
      data.tags = JSON.stringify(data.tags);
    }
    $.ajax({
      type: "POST",
      url: "/api/note?id=" + id,
      dataType: "json",
      data:data,
      success: function(data){
        console.log(data);
      }
    });
  }
}



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

cal.init({
  itemSelector: "#calendar",
  domain: "year",
  subDomain: "day",
  cellSize: 11.5,
  range: 1,
  displayLegend: false,
  data: api.listCalender(),
  start: new Date(),
  tooltip: true,
  legend: [10, 20, 30, 40],
  onClick: function(date, nb) {
    console.log(date);
    console.log(nb);
  }
});
cal.update(api.listCalender());
