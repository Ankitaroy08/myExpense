/*
 * Developed by Radu Puspana
 * Date August 2017
 * Version 1.0
 */


// module that handles the budget data using the module pattern
// this controller keeps track of all the income, expenses, the budget itself, and
// also the percentage of how much an income/expense represents of the total budget
var budgetController = (function() {

    console.log("Loading controllers.");
    console.log("Budet controller is loading...");

    // private Expense constructor
    var prvExpense = function(id, description, value) {
       this.id = id;
       this.description = description;
       this.value = value;
    };

    // private Income constructor
    var prvIncome = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // object for storing instances of prvExpense, prvIncome, totalExpenses, totalIncomes
    // every expense entered in the UI will map to an instance of prvExpense
    // every income entered in the UI will map to an instance of prvIncome
    var prvData = {

        // object with all the expenses and all of the incomes
        allItems: {
            // all expense transactions
            exp: [],

            // all income transactions
            inc: []
        },

        // object with expenses total and income total
        totals: {
            // sum of all expense transactions
            exp: 0,

            // sum of all income transactions
            inc: 0
        },

        // total budget: incomes - expenses
        budget: 0,

        // how much of the total income, in %, the total expenses represent
        // -1 = there is no income submited
        expensesPercentageIncome: -1
    };

    // calculate total income or total expenses
    // type  String  type of transaction "exp" or "inc"
    var prvCalculateTotal = function(type) {
        var sum = 0;

        // select between the exp or inc array of the prvDate object to calculate the sum of all the values of each object in the array
        prvData.allItems[type].forEach(function(currElem) {
            sum = sum + currElem.value;
        });

        // add this sum to the prvData.totals[exp] or prvData.totals[inc]
        prvData.totals[type] = sum;
    }

    return {

        // pubic method for creating a new Expense or Income instance based on user input from the UI,
        // add it to the exp or inc array of prvData.allItems, and return the new instance created
        pblAddItem: function(type, descripton, value) {

            // new reference to a new intance of prvExpense or prvIncome
            var newItem;

             // create a unique id to put in each prvExpense or prvIncome item
            var id;

            id = prvData.allItems[type].length > 0 ? prvData.allItems[type][prvData.allItems[type].length - 1].id + 1 : 0;

            // create new instance of prvExpense or prvIncome based on the type parameter
            if(type === "exp") {
                newItem = new prvExpense(id, descripton, value);
            } else if (type === "inc") {
                newItem = new prvIncome(id, descripton, value);
            }

            // object[property]
            // add expense/income to the prvData.allItems[exp] or prvData.allItems[inc] array
            // based on the type parameter
            prvData.allItems[type].push(newItem);

            // return new instance of prvExpense or prvIncome
            return newItem;
        },

        // delete a transaction from the prvData.allItems.exp or prvData.allItems.exp arrays
        // transType  string  the trasaction type "exp" or "inc" in order to extract the element from the appropiate array
        // transId    string  the trasaction id to be extracted from prvData.allItems.exp or prvData.allItems.inc
        pblDeleteItem: function(transType, transId) {

            console.info("transType %s", transType);
            console.info("transId %d", transId);

            var trasactionTypeIds, indexDeleteElem;

            // id = 6
            // [1 2 4 6 8]
            // delete the item at index at which 6 sits

            // create an array with all the ids of the trasactions submited of type transType
            trasactionTypeIds = prvData.allItems[transType].map(function(currentElem) {
                return currentElem.id;
            });
            console.info("trasactionTypeIds %O", trasactionTypeIds);

            // get the index of the element with id transId from the trasactionTypeIds array
            indexDeleteElem = trasactionTypeIds.indexOf(transId);
            console.info("indexDeleteElem %O", indexDeleteElem);

            // if the id that was passed to the function is found in the transaction ids
            if (indexDeleteElem !== -1) {

                // detele the item at index idexDeleteElem from the prvData.allItems[transType] array
                prvData.allItems[transType].splice(indexDeleteElem, 1);
            }
            console.info(" prvData.allItems[%s] %O", transType, prvData.allItems[transType]);

        },

        // to delete
        pblTestGetDataStr: function() {
            console.info("prvData = %O", prvData);
        },

        // calculate the budget after submiting a transaction
        // calculate the % shown in the expenses red row under the available budget. aka the percentage of the budget that we already spent
        pblCalculateBudget: function() {

            // calculate total income
            prvCalculateTotal("inc");

            // calculate total expenses
            prvCalculateTotal("exp");

            // calculate the budget: income - expenses
            prvData.budget = prvData.totals.inc - prvData.totals.exp;
            console.log("budget = %d", prvData.budget);

            // if at least one income transaction was submited
            // else prvData.expensesPercentageIncome = -1 it's default value
            if (prvData.totals.inc > 0){

                // calculate the percent of how much the total expenses represent out of the total income.
                // The result will have 1 decimal and it will be rounded.
                prvData.expensesPercentageIncome = roundDecimal(((prvData.totals.exp * 100) / prvData.totals.inc), 1);
            }
        },

        // return the budget, total of expenses, of income, and expense percentage
        // it's not a good idea to return the prvData object to be altered by another module
        pblGetBudgetExpIncExpPercentage: function() {
            return {
                budget: prvData.budget,
                totalExpenses : prvData.totals.exp,
                totalIncome : prvData.totals.inc,
                expensesPercentIncome : prvData.expensesPercentageIncome
            };
        },

        // log message to console
        // msg  string  message to be logged to the browser's console
        pblLogMsgToConsole: function(msg) {
            console.log(msg);
        }
    }
})();

budgetController.pblLogMsgToConsole("Budget controller has finished loading.");
