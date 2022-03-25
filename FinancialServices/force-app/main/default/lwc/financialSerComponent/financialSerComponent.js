
import { LightningElement, wire , api} from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountController.fetchAccounts';
import { NavigationMixin } from 'lightning/navigation';

export default class FinancialSerComponent extends NavigationMixin(LightningElement) {
    @api recordId;
    records;
    sortedColumn;
    sortedDirection = 'asc';
    initialRecords;

    @wire( fetchAccounts )  
    wiredAccount( { error, data } ) {
        if (data) {

            this.records = data;
            this.initialRecords = data;
            this.error = undefined;

        } else if ( error ) {

            this.error = error;
            this.initialRecords = undefined;
            this.records = undefined;

        }
    }  

    sortRecs( event ) {

        let colName = event.target.name;
        console.log( 'Column Name is ' + colName );
        if ( this.sortedColumn === colName ) {
            this.sortedDirection = ( this.sortedDirection === 'asc' ? 'desc' : 'asc' );
        }
        else {
            this.sortedDirection = 'asc';
        }

        let isReverse = this.sortedDirection === 'asc' ? 1 : -1;

        this.sortedColumn = colName;

        // sort the data
        this.records = JSON.parse( JSON.stringify( this.records ) ).sort( ( a, b ) => {
            a = a[ colName ] ? a[ colName ].toLowerCase() : ''; // Handle null values

            b = b[ colName ] ? b[ colName ].toLowerCase() : '';
            return a > b ? 1 * isReverse : -1 * isReverse;
        });;

    }

   
    handleKeyChange( event ) {  
          
        const searchKey = event.target.value.toLowerCase();  
        console.log( 'Search Key is ' + searchKey );
 
        if ( searchKey ) {  

            this.records = this.initialRecords;
 
             if ( this.records ) {

                let recs = [];
                for ( let rec of this.records ) {

                    console.log( 'Rec is ' + JSON.stringify( rec ) );
                    let valuesArray = Object.values( rec );
                    console.log( 'valuesArray is ' + valuesArray );
 
                    for ( let val of valuesArray ) {
                        
                        if ( val ) {

                            if ( val.toLowerCase().includes( searchKey ) ) {

                                recs.push( rec );
                                break;
                        
                            }

                        }

                    }
                    
                }

                console.log( 'Recs are ' + JSON.stringify( recs ) );
                this.records = recs;

             }
 
        }  else {

            this.records = this.initialRecords;

        }
 
    }  


     // Navigate to View Account Page
     navigateToViewAccountPage(event) {
        let strIndex = event.target.dataset.recordId;
        let recs =  JSON.parse( JSON.stringify( this.records ) );
        let rowId = recs[ strIndex ].Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Account',
                actionName: 'view'
            },
        });
    }

     // Navigate to Edit Account Page
     navigateToEditAccountPage(event) {
        let strIndex = event.target.dataset.recordId;
        let recs =  JSON.parse( JSON.stringify( this.records ) );
        let rowId = recs[ strIndex ].Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: rowId,
                objectApiName: 'Account',
                actionName: 'edit'
            },
        });
    }

}