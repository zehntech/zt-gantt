# Gantt Chart Library Documentation # 
  

### Introduction  
Welcome to the documentation for Gantt Chart Library. This library provides a powerful set of tools and functionalities to create interactive Gantt charts for project management. This documentation will guide you through the installation process, usage instructions, and available features of the library.   
  

### Table of Contents 
1. [Installation](#installation)
2. [Getting Started](#getting-started) 
3. [Features](#features)   
  
  
<a name="installation"></a>
### 1. Installation 
To use the Gantt Chart Library, follow these steps:  
Download the library files from our website or repository. Include the library files (gantt.js and gantt.css) in your project. Add the necessary dependencies, such as jsPDF (V. 2.5.1) and html2canvas (V. 1.4.1) if you are using the export for the pdf or PNG. Link the library files in your HTML file.
You're now ready to start using the Gantt Chart Library!    

<a href="https://zt-gantt.zehntech.net/">
  <img src="./images/zt-gantt-screenshot.png">
</a>  
  
<a name="getting-started"></a>
### 2. Getting Started 
To create a basic Gantt chart, follow these steps:   
Add files:   
~~~html
<script src="gantt.js" ></script>
<link rel="stylesheet" href="gantt.css" type="text/css">
~~~  

Add markup:  
~~~html
<div id="gantt_here" style='width:100%; height:100vh;'></div>
~~~  

Initialize the Gantt Chart Library using JavaScript by targeting the container element.   

~~~js
let element = document.getElementById("gantt_here"); 
let gantt = new ztGantt(element);
gantt.options.columns = [ 
            {name: "text",width: 245, 
              min_width: 80, 
              max_width: 300, 
              tree: true, 
              label: "Name", 
              resize: true, 
              template: (task) => { 
                return `<span>${ 
                  task.parent == 0 ? task.text : task.subject 
                }</span>`; 
              }, 
            }, 
            {name: "estimated_hours",width: 100,min_width: 80, 
              tree: false, 
              align: "center", 
              label: "Planned Hour", 
              resize: true, 
              template: (task) => { 
                return `<span>${task.estimated_hours || ""}</span>`; 
              }, 
            }, 
          ]; 
  gantt.options.data = [ 
          {"id":1, "text":"Project 1", parent: 0, progress: 50}, 
          {"id":2, "text":"Task #1", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":1, progress: 60}, 
          {"id":3, "text":"Task #2", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":1, progress: 30}, 
          {"id":5, "text":"SubTask #1", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 10}, 
          {"id":6, "text":"SubTask #2", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 80}, 
          {id: 12, text: "Final Milestone", start_date: "06-17-2023", end_date: "06-17-2023", parent: 8, type:"milestone" }, 
          {"id":7, "text":"SubTask #3", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 45}, 
          {"id":4, "text":"Task #3","parent":1, progress: 15}, 
          {"id":8, "text":"Project 2", "parent":0, progress: 55}, 
          {"id":9, "text":"Project 3", "parent":0, progress: 65}, 
          {"id":10, "text":"Project 4", "parent":0, progress: 75}, 
          {"id":11, "text":"Project 5", progress: 100}, 
          {id: 13, text: "Next Milestone", start_date: "06-17-2023", end_date: "06-17-2023", parent: 8, type:"milestone" }, 
      ] 
   gantt.options.scales= [ 
          { 
              unit: "week", 
              step: 1, 
              format: (t) => { 
              return "%d %F"; 
              }, 
          },
          { 
              unit: "day", step: 1, format: "%d %D" 
          }, 
      ]; 
gantt.options.links = [
        { "id":1, "source":1, "target":2, "type": 0},
        { "id":2, "source":2, "target":3, "type": 1},
        { "id":3, "source":3, "target":4, "type": 2},
        { "id":4, "source":12, "target":15, "type": 3}
    ]

gantt.render();
~~~ 
Define your tasks, their durations, and any dependencies. Render the chart by calling the appropriate function. gantt.render(element); Customize the chart's appearance and behavior as needed.   
  
[Live demo](https://zt-gantt.zehntech.net/)    
  
#### Complete Documentation ####  
  
[zt-gantt Documentation](https://zehntechtechnologies-my.sharepoint.com/:w:/g/personal/sunil_solanki_zehntech_com/EbocAxY9pgVNmWLMFjoT_lYBX0am2Qr_Dq-Q28xGF1feRQ?e=yeeapt)


### 3. Chart Configuration  
The Gantt Chart Library provides various configuration options to tailor the chart to your specific requirements. You can customize the chart's timeline, task bars, labels, colors, and more. 

* **Options**
    * **gantt.options.startDate and gantt.options.endDate**  
        startDate and endDate are date of the gantt range
        ```
        gantt.options.startDate = "2023-05-01T11:46:17.775Z"; 
        gantt.options.endDate = "2023-06-10T11:46:17.775Z"; 
        ```

    * **gantt.options.columns**  

        Columns of the left side grid 
        ```
        gantt.options.columns = [ 
            {name: "text",width: 245, 
              min_width: 80, 
              max_width: 300, 
              tree: true, 
              label: "Name", 
              resize: true, 
              template: (task) => { 
                return `<span>${ 
                  task.parent == 0 ? task.text : task.subject 
                }</span>`; 
              }, 
            }, 
            {name: "estimated_hours",width: 100,min_width: 80, 
              tree: false, 
              align: "center", 
              label: "Planned Hour", 
              resize: true, 
              template: (task) => { 
                return `<span>${task.estimated_hours || ""}</span>`; 
              }, 
            }, 
          ]; 
        ```  
        **name** is name of the column present in the data,   
        **width** is the actual width of that column,   
        **min_width** is the minimum width of that column,   
        **max_width** is the maximum width of that column,   
        **tree** is the Boolean for that column should become tree or not,   
        **label** is the header label of that column,   
        **resize** is for the column should be resizable or not,   
        **template** is a function that return the html string which will displayed in column row   
        
    * **gantt.options.data**     
      The task data of projects 
      You can create the nested task by assigning parent the child task parent will be the parent task id. 
      ```
      gantt.options.data = [ 
          {"id":1, "text":"Project 1", parent: 0, progress: 50}, 
          {"id":2, "text":"Task #1", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":1, progress: 60}, 
          {"id":3, "text":"Task #2", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":1, progress: 30}, 
          {"id":5, "text":"SubTask #1", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 10}, 
          {"id":6, "text":"SubTask #2", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 80}, 
          {id: 12, text: "Final Milestone", start_date: "06-17-2023", end_date: "06-17-2023", parent: 8, type:"milestone" }, 
          {"id":7, "text":"SubTask #3", "start_date":"05-05-2023", "end_date": "05-05-2023","parent":3, progress: 45}, 
          {"id":4, "text":"Task #3","parent":1, progress: 15}, 
          {"id":8, "text":"Project 2", "parent":0, progress: 55}, 
          {"id":9, "text":"Project 3", "parent":0, progress: 65}, 
          {"id":10, "text":"Project 4", "parent":0, progress: 75}, 
          {"id":11, "text":"Project 5", progress: 100}, 
          {id: 13, text: "Next Milestone", start_date: "06-17-2023", end_date: "06-17-2023", parent: 8, type:"milestone" }, 
      ] 
      ```  
      **id** is the task id,   
      **text** is the text for displaying text of task,   
      **parent** is the id of the parent task, if task is at top level then parent is 0,   
      **start_date** is the start date of the task,  
      **end_date** is the end date of the task,  
      **progress** is the percentage of task completion,      
      **type** is the type of the task, it can be **milestone** or **task**   
      
    * **gantt.options.taskProgress**  
      To enable progress in taskbar  
      type: Boolean, byDefault it is false    
      `gantt.options.taskProgress = true;`  
      
    * **gantt.options.rightGrid**  
    Columns for the right-side grid, it is optional.
    ```
    gantt.options.rightGrid = [ 
        { 
          name: "estimated_hours", 
          label: "Total", 
          width: 100, 
          align: "center", 
          resize: true, 
          template: function (task) { 
            var totalHours = 0; 
            return `<b>${task.estimated_hours}</b>`; 
          }, 
        }, 
        { 
          name: "Stats", 
          width: 100, 
          label: "Stats", 
          align: "center", 
          resize: true, 
          template: function (task) { 
            return `<b>${task.estimated_hours}</b>`; 
          }, 
        }, 
      ]; 
    ```
    * **gantt.options.scales**  
      Scales array of the timeline
      ```
      gantt.options.scales= [ 
          { 
              unit: "week", 
              step: 1, 
              format: (t) => { 
              return "%d %F"; 
              }, 
          },
          { 
              unit: "day", step: 1, format: "%d %D" 
          }, 
      ]; 
      ```  
      **unit** is the unit of the scale column in which format you want the scale,   
      Here are 6 types of units: -  
          1. hour,   
          2. day,  
          3. week,  
          4. month,  
          5. quarter,   
          6. year  

 
      **step** is the number of steps you want to include in the column,     
      **format** it can be a string or function which return the string which is the format of the date   
      
    * **gantt.options.zoomLevel**    
      To change the zoom level of the gantt timeline  
      `gantt.options.zoomLevel = "day";`    
      Here are 5 levels 
        1. hour,   
        2. day,  
        3. week,  
        4. month,  
        5. quarter,  
        6. year  
            
          
    * **gantt.options.zoomConfig**  
      The configuration for different levels of zoom   
      **name** is name of zoom level  
      **scale_hight** is hight of scale for the zoom level  
      **min_col_width** is min column width for the zoom level  
      **scales** is the scales for the zoom level  
      After setting zoomLevel and zoomConfig run **gantt.zoomInit()** for applying your current zoom level    
      ```
      gantt.options.zoomConfig = { 
        levels: [ 
          { 
            name: "day", 
            scale_height: 27, 
            min_col_width:80, 
            scales: [{ unit: "day", step: 1, format: "%d %M" }], 
          }, 
          { 
            name: "week", 
            scale_height: 50, 
            min_col_width:50, 
            scales: [ 
              { 
                unit: "week", 
                step: 1, 
                format: function (date) { 
                  var dateToStr = gantt.formatDateToString("%d %M"); 
                  var endDate = gantt.add(date, 6, "day"); 
                  var weekNum = gantt.formatDateToString("%W",date); 
                  return ( 
                    "#" + 
                    weekNum + 
                    ", " + 
                    gantt.formatDateToString("%d %M",date) + 
                    " - " + 
                    gantt.formatDateToString("%d %M",endDate) 
                  ); 
                }, 
              }, 
              { unit: "day", step: 1, format: "%j %D" }, 
            ], 
          }, 
          { 
            name: "month", 
            scale_height: 50, 
            min_col_width:120, 
            scales: [ 
              { unit: "month", format: "%F, %Y" }, 
              { unit: "week", format: "Week #%W" }, 
            ], 
          }, 
          { 
            name: "quarter", 
            scale_height: 50, 
            min_col_width:90, 
            scales: [ 
              { unit: "month", format: "%F, %Y" }, 
              { unit: "week", format: "Week #%W" }, 
            ], 
          }, 
          { 
            name: "year", 
            scale_height: 50, 
            min_col_width: 30, 
            scales: [{ unit: "year", step: 1, format: "%Y" }], 
          }, 
        ], 
      };
      ```  

    * **gantt.options.addLinks**  
    To show task relation 	through links in the Gantt    
    type: Boolean, by default it is false.  
    `gantt.options.addLinks = true`   
      
    * **gantt.options.links**  
    Task relations array  
    type: Array  
    ```  
    gantt.options.links = [
        { "id":1, "source":1, "target":2, "type": 0},
        { "id":2, "source":2, "target":3, "type": 1},
        { "id":3, "source":3, "target":4, "type": 2},
        { "id":4, "source":12, "target":15, "type": 3}
    ]
    ```  
    **source** is source id  
    **target** is target id  
    **type** is type of link  
    Links types can be of 4 type  
    **0** is **finish_to_start**  
    **1** is **start_to_start**    
    **2** is **finish_to_finish**  
    **3** is **start_to_finish**    
    
    * **gantt.options.collapse**  
    To make the tree initially collapse or open  
    type: Boolean, by default it is true.  
    `gantt.options.collapse = false; `  
      
    * **gantt.options.addTaskOnDrag**    
      For selecting task start and end through drag  
      type: Boolean, by default it is false.    
      `gantt.options.addTaskOnDrag = true;`
      
    * **gantt.options.fullWeek**  
    Show the full week or workdays.  
    type: Boolean, by default it is true.  
    `gantt.options.fullWeek = true;`
    
    * **gantt.options.todayMarker**  
    It adds a vertical marker at today’s date column.  
    type: Boolean, by default it is true.  
    `gantt.options.todayMarker = false;`
    
    * **gantt.options.weekends**  
    type: Array, array of strings “Sat”, "Sun”, to set the weekends dynamically.   
    `gantt.options.weekEnds = [“Sat”, "Sun”];`
    
    * **gantt.options.weekStart**  
    You can pass from 0 to 6.  
    type: Number, it set the start of the week, by default it is set to 1 means "Monday".   
    `gantt.options.weekStart = 0;`
    
    * **gantt.options.scale_height**  
    To set the height of the scale. You can pass the number value which will apply to all scales or you can 	pass the Array for different height for different scales respectively.    
    type: Number or Array, `30 || [20, 30]`, set the height of scales, by default, it is 30.   
    `gantt.options.scale_height = [20, 30];`
    
    * **gantt.options.row_height**  
    To set the height of the row.   
    type: Number, by default it is 50.  
    `gantt.options.row_height = 60;`
    
* **Templates**
    * **gantt.templates.tooltip_text**  
        It is a function template which return the html for the tooltip  
        ```
        gantt.templates.tooltip_text = function (start, end, task) { 
            return `<b>${task.parent === 0 ? "User" : "Task"}:</b> 
                ${task.parent === 0 ? task.text : task.subject} 
                <br/><b>Start date:</b>${start} 
                <br/><b>End date:</b>${end} 
                <br/> 
                <b>Duration:</b> ${task.duration} ${ 
              task.duration > 1 ? "Days" : "Day" 
            }`; 
          }; 
        ```

    * **gantt.templates.taskbar_text**  
        It returns the html for the taskbars 
        ```
        gantt.templates.taskbar_text = function (start, end, task) { 
            if (task.parent == 0) { 
              return `User : ${task.text}`; 
            } else { 
              return `Task : ${task.subject}`; 
            } 
          }; 
          ```

    * **gantt.templates.task_drag**  
        It returns true or false, for allowing the task drag 
        ```
        gantt.templates.task_drag = (mode, task) => { 
            if (task.parent == 0 || (task.children && task.children.length > 0)) { 
              return false; 
            } 
            return true; 
      }; 
      ```
 
    * **gantt.templates.grid_folder**  
        It returns the grid folder html 
        ```
        gantt.templates.grid_folder = (task) => { 
                return `<div class="folder-class">Folder</div>`; 
              }; 
        ```

    * **gantt.templates.grid_file**  
        It returns the grid file html 
        ```
        gantt.templates.grid_file = (task) => { 
                return `<div class="file-class">File</div>`; 
              }; 
        ```
 
    * **gantt.templates.grid_header_class**  
        It returns the class for the left grid header   
        You can add multiple classes by separating them with space. 
        ```
        gantt.templates.grid_header_class = (columns,index) => { 
                return "my-header-class header-class" 
              } 
        ```

    * **gantt.templates.grid_row_class**  
        It returns the class for the row of left grid   
        You can add multiple classes by separating them with space. 
        ```
        gantt.templates.grid_row_class = (start, end, task) => { 
                return "my-grid-row-class" 
              } 
        ```

    * **gantt.templates.task_class**  
        It returns classes for task 
        ```
        gantt.templates.task_class = (start, end, task) => { 
                return "my-task-class" 
              } 
        ```
 
    * **gantt.templates.task_row_class**   
        It returns classes for the task row 
        ```
        gantt.templates.task_row_class = (start, end, task) => { 
            return "my-task-row-class" 
          } 
        ```
   
    * **gantt.templates.scale_cell_class**  
        It returns classes for the timeline scales   
        ```
        gantt.templates.scale_cell_class = (date, scale, scaleIndex) => { 
                return "my-scale-class" 
              } 
        ```

    * **gantt.templates.grid_cell_class**    
        It returns classes for the left grid cell 
        ```
        gantt.templates.grid_cell_class = (col, task) => { 
                return "my-grid-cell-class" 
              } 
        ```
        
    * **gantt.templates.timeline_cell_class**   
        It returns classes for the timeline cell 
        ```
        gantt.templates.timeline_cell_class = (task, date) => { 
                return "my-task-cell-class" 
              } 
        ```
 
    * **gantt.templates.showLightBox**   
        It returns the html for the popup modal open on dblclick   
        ```
        gantt.templates.showLightBox = (task)=>{ 
        return `<form action="/action_page.php"> 
          <label for="fname">First name:</label><br>  
          <input type="text" id="fname" name="fname" value="John"><br>  
          <label for="lname">Last name:</label><br>  
          <input type="text" id="lname" name="lname" value="Doe"><br><br>  
          <input type="submit" value="Submit">  
        </form>` 
        } 
        ```
### 4. Methods
* **Format Date to String**  
  `gantt.formatDateToString(format, date);`  
  formateDateToString is for formatting date in required format  
  Here format is the format in which we want the date and date is the date which we want to formate. 

  **While specifying the format for dates you can use any character from the following list:** 
  * **%y** - the year as a two-digit number (00 to 99); 
  * **%Y** - the year as a four-digit number (1900-9999); 
  * **%m** - the month as a number with a leading zero (01 to 12); 
  * **%n** - the month as a number without a leading zero (1 to 12); 
  * **%M** - the month as an abbreviation (Jan to Dec); 
  * **%F** - the month as a full name (January to December); 
  * **%W** - the week number of the year. Weeks start on Monday; 
  * **%d** - the day as a number with a leading zero (01 to 31); 
  * **%j** - the day as a number without a leading zero (1 to 31); 
  * **%D** - the day as an abbreviation (Sun to Sat); 
  * **%l** - the day as a full name (Sunday to Saturday); 
  * **%h** - the hour based on the 12-hour clock (00 to 11); 
  * **%H** - the hour based on the 24-hour clock (00 to 23); 
  * **%g** - the hour based on the 12-hour clock without a leading zero (1 to 12); 
  * **%G** - the hour based on the 24-hour clock without a leading zero (0 to 23); 
  * **%i** - the minute as a number with a leading zero (00 to 59); 
  * **%s** - the second as a number with a leading zero (00 to 59); 
  * **%a** - displays am (for times from midnight until noon) and pm (for times from noon until midnight); 
  * **%A** - displays AM (for times from midnight until noon) and PM (for times from noon until midnight).  
  **For example, if you want 20th June 2023 as 20/06/2023, you should specify "%d/%m/%Y".**     
    
* **Get the current zoom level scale config**  
  Function to get the current level zoom scale   
  `gantt.getScale();`  
  
* **Initialize zoom level**
  To initialize the zoom level, call this method.  
  `gantt.zoomInit();`    
  
* **Add days, week, month, year, hour, and minute to a date**   
  `gantt.add(date, number, unit)`   
  **date** - (Date) the date object that you need to add a time to/subtract a time from.  
  **number** - (number) the number of units to add. If this number is positive - the time will be added to the date, if negative - the time will be subtracted  
  **unit** - (string) the time unit. Values: 'minute', 'hour', 'day', 'week', 'month', 'year'.   

* **Request FullScreen**   
  for view gantt in fullscreen 
  `gantt.requestFullScreen();`

* **Exit FullScreen**   
for exiting fullScreen   
`gantt.exitFullScreen();` 

* **Expand All**  
for expanding all tasks  
`gantt.expandAll();`  

* **Collapse All**  
for collapsing all tasks  
`gantt.collapseAll();`  

* **Get Task**  
for getting task by id  
`gantt.getTask(id)`  

* **Filter Tasks**  
`gantt.filterTask(condition, isFilter);`  
condition is a function in which return the condition of the filter   
isFilter is type of Boolean which state that filter should apply or not.   
```
gantt.filterTask((task) => { 
          if (task.parent === 0) { 
            return task.text 
              .toLowerCase() 
              .includes(“string”.toLowerCase()); 
          } else { 
            return task.subject 
              .toLowerCase() 
              .includes(“string”.toLowerCase()); 
          } 
        }, true); 
```

* **Add Custom Marker** 
    ```
    let marker = { 
        start_date: gantt.add(new Date(), 1, "day"), //a Date object that sets the marker's date 
        css: "tomorrow", //a CSS class applied to the marker 
        text: "Tomorrow", //the marker title 
        title: gantt.formatDateToString("%d %M %y",gantt.add(new Date(), 1,"day")), 
    } 
    
    gantt.addMarker(marker); 
    ```
    **start_date** is the start date of the marker  
    **css** is the classes applied to the marker it could be multiple separated by space   
    **text** is the text added to the marker   
    **title** is the title added to the marker   
    
* **Add Today Marker**   
It adds a today marker to the gantt   
`gantt.addTodayFlag();`  

* **Remove Today Marker**   
`gantt.removeTodayFlag();`   

* **Add Task*   
`gantt.addTask(task);`  
here **task** is the new task to add 

* **Update Task**  
`gantt.updateTaskData(task);`  
here **task** is the updated task  

* **Delete Task**  
`gantt.deleteTask(id);`  
here **id** is the id of the task   

* **Loop through all tasks**  
It iterates through all tasks 
```
gantt.eachTask((task)=>{   
console.log(task);   
}) 
```

* **Open Task**   
Used for opening a perticular task tree  
`gantt.openTask(id);` 

* **Add Data to existing data**  
`gantt.parse(data);`   
using this you can add new data to the existing data in gantt   
here data is array which contain new data   

* **Get the position of the date cell from timeline start**   
`gantt.posFromDate(date);`   

* **Clear All**  
It clears the old data   
use it only when you change the data from your side.   
`gantt.clearAll();`   

* **Delete Link**  
function to delete a link   
`gantt.deleteLink(id);`   

* **Export To PNG**   
for exporting gantt to PNG   
`gantt.exportToPNG(name);`   
here **name** is for the exported file name, it's optional  

* **Export To PDF**  
for exporting gantt to PDF  
`gantt.exportToPDF(name);`  
here **name** is for the exported file name, it's optional 

* **Export To Excel**   
for exporting gantt to Excel   
`gantt.exportToExcel(name);`   
here **name** is for the exported file name, it's optional  

* **Render Gantt**  
Here **element** is the div where you want to append gantt,   
**element** is optional if you are not calling render function first time in your code;  
`gantt.render(element);`    

* **Auto Scheduling**   
 `gantt.autoScheduling();`  
 Call this method to automatically schedule your tasks based on the relations between them.  
   

### 5. Events
* **On Task DblClick**   
Triggered when Double clicked on the task   
```
gantt.attachEvent("onTaskDblClick", (event) => { 
        console.log("onTaskDblClick: ", event); 
      }); 
```

* **On Link DblClick**   
Triggered when Double clicked on the link   
```
gantt.attachEvent("onLinkDblClick", (event) => { 
        console.log("onLinkDblClick: ", event); 
      }); 
```

* **On Link Add**    
Triggered when link added  
```
gantt.attachEvent("onLinkAdd", (event) => { 
        console.log("onLinkAdd: ", event); 
      }); 
```

* **On Delete Link**   
Triggered when link deleted  
```
gantt.attachEvent("onDeleteLink", (event) => { 
        console.log("onDeleteLink: ", event); 
      }); 
```
 
* **On Before Task Drag**   
Triggered before the dragging of the task  
```
gantt.attachEvent("onBeforeTaskDrag", (event) => { 
        console.log("onBeforeTaskDrag: ", event); 
        if (event.task.children.length !== 0) { 
          return false; 
        } else { 
          return true; 
        } 
      }); 
```

* **On Task Drag**   
Triggered on the dragging of the task   
```
gantt.attachEvent("onTaskDrag", (event) => { 
        console.log("onTaskDrag: ", event); 
      }); 
```
 
* **On Before Task Drop**   
Triggered before task drop  
```
gantt.attachEvent("onBeforeTaskDrop", (event) => { 
        console.log("onBeforeTaskDrop: ", event); 
        if (event.parentTask.id == 12) { 
          return false; 
        } 
      }); 
```
 
* **On After Task Drag**   
Triggered after the dragging of the task
```
gantt.attachEvent("onAfterTaskDrag", (event) => { 
        console.log("onAfterTaskDrag: ", event); 
      }); 
```  
    
* **On Task Delete**   
Triggered when the task deleted  
```
gantt.attachEvent("onTaskDelete", (event) => { 
        console.log("onTaskDelete: ", event); 
      }); 
```
    
* **On After Task Update**  
Triggered after the task updated  
```
gantt.attachEvent("onAfterTaskUpdate", (event) => { 
        console.log("onAfterTaskUpdate: ", event); 
      }); 
```
 
* **On Scroll**  
```
Triggered when you scroll gantt 
gantt.attachEvent("onScroll", (event) => { 
        console.log("onScroll: ", event); 
      }); 
```
 
* **On Resize**  
Triggered on window resize  
```
gantt.attachEvent("onResize", (event) => { 
        console.log(" onResize: ", event); 
      }); 
```
 
* **On Timeline cell click**    
Triggered when clicked on the timeline cell  
```
gantt.attachEvent("onCellClick", (event) => { 
        console.log("onCellClick: ", event); 
      }); 
```

* **On Expand**   
Triggered when requested fullscreen  
```
gantt.attachEvent("onExpand", (event) => { 
        console.log("onExpand: ", event); 
      }); 
```
 
* **On Collapse**  
Triggered when exited fullscreen   
```
gantt.attachEvent("onCollapse", (event) => { 
        console.log("onCollapse: ", event); 
      }); 
```  
  
* **Add Task on Drag**  
  Select start & end date of new Task through Drag   
  ```
  gantt.attachEvent("addTaskOnDrag", (event) => {
        gantt.addTask({
          id: "Added12",
          start_date: event.task.startDate,
          end_date: event.task.endDate,
          parent: event.task.parent,
          text: "Task Added"
        })
        gantt.render();
      });
  ```    
  
* **On After Progress Drag**     
  Triggered after task progress drag	  
  ```
  gantt.attachEvent("onAfterProgressDrag", (event) => { 
    console.log("onAfterProgressDrag: ", event); 
  }); 
  ```
    
### 6. Example  
For further details, please consult this example. [ztGantt](https://zt-gantt.zehntech.net/)
 