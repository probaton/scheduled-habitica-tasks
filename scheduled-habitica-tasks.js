var USER_ID = "your-user-id-here";
var API_TOKEN = "your-api-token-here";

function scheduleTasks() {
  var rawEvents = CalendarApp.getCalendarsByName("HabiticaReminders")[0].getEventsForDay(new Date());
  var batchEvents = [];
  var taskPoster = new TaskPoster();
  
  rawEvents.forEach(function(event) {
    var parsedNotes = parseNotes(event.getDescription());
    if (parsedNotes["checklist"]) {
      taskPoster.postChecklistTask(event.getTitle(), parsedNotes["taskNotes"], parsedNotes["checklist"]);
    } else {
      batchEvents.push(taskPoster.makeTaskObj(event.getTitle(), parsedNotes["taskNotes"]));
    }
  });
  taskPoster.postTasks(batchEvents);

  if (taskPoster.failList) {
    var errorMessage = "The following tasks and checklist items failed to post:\n" + taskPoster.failList;
    throw new Error(errorMessage);
  }
}
    
function parseNotes(eventNotes) {
  var noteLines = eventNotes.split("\n");
  var checklist = [];
  var taskNotes = "";

  noteLines.forEach(function(noteLine) {
    if (noteLine.indexOf("- ") == 0) {
      checklist.push({ "text": noteLine.slice(2) });
    } else {
      taskNotes += noteLine + "\n";
    }
  });
  return checklist.length > 0 ? { taskNotes: taskNotes, checklist: checklist } : { taskNotes: eventNotes };
}

var TaskPoster = function() {
  this.failList = "";
  self = this;
  
  this.postChecklistTask = function(task, notes, checklist) {
    var taskObj = self.makeTaskObj(task, notes)
    var taskId = self.postTasks([taskObj]);
    checklist.forEach(function(item) {
      var postChecklistResult = postHabApi("/api/v3/tasks/" + taskId + "/checklist", item);
      if (!postChecklistResult) { 
        self.addToFailList(item["text"]); 
      }
    });
  }
  
  this.postTasks = function(tasks) {
    var postResult = postHabApi("/api/v3/tasks/user", tasks);
    if (postResult) {
      return postResult["data"]["id"];
    } else {
      tasks.forEach(function(task) {
        self.addToFailList(task["text"]);
      });
      return null;
    }
  }
  
  this.makeTaskObj = function(text, notes) {
    return {
          "text": text, 
          "type": "todo",
          "priority": "1.5",
          "notes": notes,
          "collapseChecklist": true,    
        }
  }

  this.addToFailList = function(fail) {
    self.failList += "<" + fail + ">\n";
  }
}

function getHabReqOpts(method) {
  return {
    "method" : method,
    "headers" : {
      "x-api-user": USER_ID, 
      "x-api-key": API_TOKEN,
    },
    "muteHttpExceptions": true
  };
}
  
function callHabApi(endpoint, opts) {  
  var apiUrl = "https://habitica.com" + endpoint;
  var response = UrlFetchApp.fetch(apiUrl, opts);
  if (response) {
    var statusCode = response.getResponseCode();
    if (statusCode != 200 && statusCode != 201) {
      Logger.log("Request failed\nURL: " + apiUrl
                  + "\nStatus code: " + statusCode
                  + "\nMessage: " + response.getContentText()
                );
      return null;
    }
    return JSON.parse(response);
  } else {
    Logger.log("Habitica request did not receive a reponse");
    return null;
  }
}

function getHabApi(endpoint) {
  return callHabApi(endpoint, getHabReqOpts("get"));
}

function postHabApi(endpoint, data) {
  var opts = getHabReqOpts("post");
  if (data) {
    opts["contentType"] = "application/json";
    opts["payload"] = JSON.stringify(data);
  }

  return callHabApi(endpoint, opts);
}

