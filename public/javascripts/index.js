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
  listAllNotes : function(callback){
    $.ajax({
      type: "GET",
      url: "/api/list",
      dataType: "json",
      success: function(data){
        console.log(data);
        if(callback){
          callback(data);
        }
      }
    });
  },
  listNotesByDate : function(date,callback){
    $.ajax({
      type: "GET",
      url: "/api/list?date=" + date.getTime(),
      dataType: "json",
      success: function(data){
        console.log(data);
        if(callback){
          callback(data);
        }
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

var nodeManage = {
  refreshNotes:function(options){
    var that = this;
    that.clearNotes();
    that.addNoteData(options.data.result, options.limit);
  },
  addNoteData:function(datas, limit, order){
    var i = 0;
    if(limit){
      var limit = limit>datas.length?datas.length:limit;
    }else{
      var limit = datas.length;
    }
    var ul_node = $("#notelist_ul");
    for(i = 0; i < limit ; i++){
      var data = datas[i];
      var li_node_html = "<li><a href='#' class='title'>" + data.content + "</a></li>"
      var li_node = $(li_node_html);
      /*
      var j = 0;
      for(j = 0;j < data.tags.length ;j++){
        var tag_node_html = "<span class = 'tag_class'>#" + data.tags[j] + "</span>"
        var tag_node = $(tag_node_html);
        li_node.append(tag_node);
      }
      */
      var month_obj = {
        1:"Jan",
        2:"Feb",
        3:"Mar",
        4:"Apr",
        5:"May",
        6:"Jun",
        7:"Jul",
        8:"Aug",
        9:"Sep",
        10:"Oct",
        11:"Nov",
        12:"Dec"
      }
      var date = new Date(data.date);
      var date_node_html = "<span style = 'padding-left: 5px'>" + month_obj[date.getMonth() + 1] + " " + date.getDate()  + "</span>"
      var date_node = $(date_node_html);
      li_node.append(date_node);
      ul_node.append(li_node);
    }
  },
  clearNotes:function(){
    $("#notelist_ul")[0].innerHTML = "";
  }
}

var cal = new CalHeatMap();

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
  legend: [1, 2, 3, 4],
  onClick: function(date, nb) {
    api.listNotesByDate(date, function(data){
      var options = {
        data : data
      }
      nodeManage.refreshNotes(options);
    });
  }
});
cal.update(api.listCalender());

api.listAllNotes(function(data){
  var options = {
    data : data,
    limit : 3
  }
  nodeManage.refreshNotes(options);
});