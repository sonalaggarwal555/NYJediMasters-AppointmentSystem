public class ContactListController {
        
    @AuraEnabled
    public static List<Contact> getContactList() {
                List<Contact> contactList = [SELECT Id, Name, Email FROM Contact];
        return contactList;
    }
}