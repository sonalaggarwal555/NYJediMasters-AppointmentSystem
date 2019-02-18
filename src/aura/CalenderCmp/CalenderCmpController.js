({
	 afterScriptsLoaded: function(cmp,evt,helper){         
         helper.fetchCalenderEvents(cmp);
    },
    
    newAppointment: function(component, event, helper) {
        var currentDate = new Date();
        var createRecordEvent = $A.get("e.force:createRecord");
                createRecordEvent.setParams({
                    "entityApiName": "Event"
                });
                createRecordEvent.fire();
    }
})