public with sharing class AccountController {
 
        @AuraEnabled( cacheable = true )
        public static List< Account > fetchAccounts() {
         
            return [
                SELECT Id, Name, OwnerId, Phone, Website, AnnualRevenue
                FROM Account 
                where Industry = 'Financial Services'
                LIMIT 10
            ];
             
        }

        @AuraEnabled( cacheable = true )
        public static List< Account > fetchAccounts1(String searchKey) {
         String strKey = '%' + searchKey + '%';
            return [
                SELECT Id, Name, OwnerId, Phone, Website, AnnualRevenue
                FROM Account 
                where Industry = 'Financial Services' and Name Like:strKey
                LIMIT 10
            ];
             
        }
         
    }