/**
 * Created by zhenghao on 16/2/6.
 */

var api = {
  apiHost:"http://127.0.0.1:3000",
  listCalender: function(){
    var that = this;
    var result;
    $.ajax({
      type: "GET",
      async: false,
      url: that.apiHost + "/api/calender",
      dataType: "json",
      success: function(data){
        result = data.result;
      }
    });
    return result;
  },
  listAllNotes : function(callback){
    var that = this;
    $.ajax({
      type: "GET",
      url: that.apiHost + "/api/list",
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
    var that = this;
    $.ajax({
      type: "GET",
      url: that.apiHost + "/api/list?date=" + date.getTime(),
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
    var that = this;
    $.ajax({
      type: "GET",
      url: that.apiHost + "/api/list?tag=" + tag,
      dataType: "json",
      success: function(data){
        console.log(data);
      }
    });
  },
  addNewNote : function(data,callback){
    var that = this;
    if((toString.apply(data.tags) === '[object Array]')&& (data.tags)){
      data.tags = JSON.stringify(data.tags);
    }
    $.ajax({
      type: "POST",
      url: that.apiHost + "/api/add",
      dataType: "json",
      data:data,
      success: function(data){
        console.log(data);
        callback();
      }
    });
  },
  deleteNote : function(_id,callback){
    var that = this;
    $.ajax({
      type: "delete",
      url: that.apiHost + "/api/note?id=" + _id,
      dataType: "json",
      success: function(data){
        console.log(data);
        callback();
      }
    });
  },
  updateNote:function(id,data){
    var that = this;
    if((toString.apply(data.tags) === '[object Array]')&& (data.tags)){
      data.tags = JSON.stringify(data.tags);
    }
    $.ajax({
      type: "POST",
      url: that.apiHost + "/api/note?id=" + id,
      dataType: "json",
      data:data,
      success: function(data){
        console.log(data);
      }
    });
  }
}

var nodeManage = {
  showInput: function(){
    $("#Notesinput")[0].value = "";
    $("#Notesinput_container").fadeToggle();
    $("#Notesinput").focus();
  },
  refreshNotes:function(options){
    var that = this;
    that.clearNotes();
    that.addNoteData(options.data.result, options.limit);
  },
  addNoteData:function(datas, limit, order){
    var that = this;
    var i = 0;
    if(limit){
      var limit = limit>datas.length?datas.length:limit;
    }else{
      var limit = datas.length;
    }
    $(".text-emphasized").text(limit);
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

      var bottonNode = $("<div class='labels-list-actions right'></div>");
      li_node.append(bottonNode);

      var EditBotton = $('<button class="btn-link labels-list-action js-edit-label"><svg aria-hidden="true" class="octicon octicon-pencil" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path d="M0 12v3h3l8-8-3-3L0 12z m3 2H1V12h1v1h1v1z m10.3-9.3l-1.3 1.3-3-3 1.3-1.3c0.39-0.39 1.02-0.39 1.41 0l1.59 1.59c0.39 0.39 0.39 1.02 0 1.41z"></path></svg></button>')
      EditBotton[0].data = data;
      bottonNode.append(EditBotton);
      EditBotton.click(function(){
        console.log(this.data);
      })
      var DeleteBotton = $('<button class="btn-link labels-list-action js-details-target"><svg aria-hidden="true" class="octicon octicon-x" height="16" role="img" version="1.1" viewBox="0 0 12 16" width="12"><path d="M7.48 8l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75-1.48-1.48 3.75-3.75L0.77 4.25l1.48-1.48 3.75 3.75 3.75-3.75 1.48 1.48-3.75 3.75z"></path></svg></button>');
      DeleteBotton[0].data = data;
      bottonNode.append(DeleteBotton);
      DeleteBotton.click(function(){
        console.log(this.data);
        api.deleteNote(this.data._id, function(){
          noteZH.cal.update(api.listCalender());
          api.listAllNotes(function(data){
            var options = {
              data : data,
              limit : 3
            }
            nodeManage.refreshNotes(options);
          });
        })
      })

      ul_node.append(li_node);
    }
  },
  clearNotes:function(){
    $("#notelist_ul")[0].innerHTML = "";
  }
}

var noteZH = {
  init:function(){
    var that = this;
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
    that.cal = cal;
    cal.update(api.listCalender());
    api.listAllNotes(function(data){
      var options = {
        data : data,
        limit : 3
      }
      nodeManage.refreshNotes(options);
    });
    that.catchinput({
      toggle : function(){
        nodeManage.showInput();
      },
      addNote: function(){
        var that = this;
        var addString = $("#Notesinput")[0].value;
        var addArray = addString.split(" #");
        var data = {
          content: addArray[0], date:new Date(), tags:addArray.splice(1)
        }
        api.addNewNote(data, function(){
          cal.update(api.listCalender());
          api.listAllNotes(function(data){
            var options = {
              data : data,
              limit : 3
            }
            nodeManage.refreshNotes(options);
          });
          that.toggle();
        });
      }
    });
  },
  catchinput:function(callback){
    var map = {
      84: 2,
      13: 3,
    }
    document.addEventListener("keydown", function (event) {
      var modifiers = event.altKey;
      var mapped    = map[event.which];
      if (modifiers) {
        if (mapped !== undefined) {
          event.preventDefault();
          if(mapped == 2){
            callback.toggle();
          }
        }
      }
      if(mapped == 3){
        callback.addNote();
      }
    });
  }
}
noteZH.init();