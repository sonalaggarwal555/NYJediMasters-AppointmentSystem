({
	loadDataToCalendar :function(component,data){  
        //Find Current date for default date
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var currentDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
         
        var self = this;
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay,list'
            },
            businessHours: {
                dow: [ 1, 2, 3, 4, 5 ], // Monday - Friday
                start: '09:00', 		// 9 AM 
                end: '18:00' 			// 6 PM
            },
            height: 500,
            themeSystem: 'jquery-ui',
            nowIndicator : true,
            selectable : true,
            defaultDate: currentDate,
            editable: true,
            eventLimit: true,
            events:data,
            dragScroll : true,
             droppable: true,
            weekNumbers : true,
            eventDrop: function(event, delta, revertFunc) {
                alert(event.title + " was dropped on " + event.start.format());
                if (!confirm("Are you sure about this change?")) {
                  revertFunc();
                }
                  else{
                      var eventid = event.id;
                      var eventdate = event.start.format();
                      self.editEvent(component,eventid,eventdate);
                  }            
              },
            eventClick: function(event, jsEvent, view) {
                var editRecordEvent = $A.get("e.force:editRecord");
                editRecordEvent.setParams({
                "recordId": event.id
                });
                editRecordEvent.fire();
          	},
            dayClick :function(date, jsEvent, view) {
                var eventStartDate = new Date(date.format('YYYY-MM-DD[T]HH:mm'));
                
                if((eventStartDate.getHours() ===  0 && moment().diff(date, 'days') > 0) || (eventStartDate.getHours() !==  0 && moment().diff(date) > 0)){
                    // The desired date is in past. Skipping creation of event.
                    return;
                }
                
                var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": "Event",
                    "defaultFieldValues": {
                    'StartDateTime' :  new Date(date.format('YYYY-MM-DD[T]HH:mm'))
                    }
                });
                createRecordEvent.fire();
          	},
            eventMouseover : function(event, jsEvent, view) {
            }
    });
    }, 
    
    formatFullCalendarData : function(component,events) {
        var jsonDataArray = [];
        for(var i = 0;i < events.length;i++){
            var startdate = $A.localizationService.formatDateTime(events[i].StartDateTime);
            var enddate = $A.localizationService.formatDateTime(events[i].EndDateTime);
            jsonDataArray.push({
                'title':events[i].Subject,
                'start':startdate,
                'end':enddate,
                'id':events[i].Id
            });
        }
      
        return jsonDataArray;
    },
    
    fetchCalenderEvents : function(component) {
         var action=component.get("c.getAllEvents");
         action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data= response.getReturnValue();
                var jsonArr = this.formatFullCalendarData(component,response.getReturnValue());
                this.loadDataToCalendar(component,jsonArr);
                component.set("v.Objectlist",jsonArr);
            }else if (state === "ERROR") {
                alert("Error Encoutered. Please try again.");
            }
        });
        
        $A.enqueueAction(action);
    }
})