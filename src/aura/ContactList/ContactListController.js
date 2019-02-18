({
        getContactsList : function(component, event, helper) {      
                helper.fetchContacts(component, event, helper);
        },

    newContact: function(component, event, helper) {
        var createContact = $A.get("e.force:createRecord");
        createContact.setParams({
            "entityApiName": "Contact",
        });
        createContact.fire();
    }
})