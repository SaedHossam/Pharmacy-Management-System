
var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});


let inoviceId = document.location.search.replace(/^.*?\=/, '');

// All Elements 
const tableBody = document.getElementById("t-body");
const customer_nameEl = document.getElementById('customerName');
const inovice_typeEl = document.getElementById('inoviceType');
const inovice_dateEl = document.getElementById('inoviceDate');
const drug_nameEl = document.getElementById('drugNameDrobButton');
const items_dropdownEl = document.getElementById('itemsDropdown');
const item_searchEl = document.getElementById('searchItem');
const drug_quantityEl = document.getElementById('orderedQuantity');
const drug_typeEl = document.getElementById('orderedType');

const inovice_total_itemsEl = document.getElementById('totalItems');
const inovice_total_moneyEl = document.getElementById('totalMoney');
const inovice_paidEl = document.getElementById('paid');

const btnAddItem = document.getElementById('addItem');
const btnDeleteItem = document.getElementById('deleteItem');
const btnCancelItem = document.getElementById('cancelItem');

const btnSaveInovice = document.getElementById('save');
const btnCancelInovice = document.getElementById('cancel');
const btnDeleteInovice = document.getElementById('delete');

let inoviceTotalItems = 0;
let inoviceTotalPrice = 0;
let paid = 0;

init(getRows);

function transError(t, e) {
    console.log(t);
    console.log(e);
    console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}
// if success
function transSuccess(t, r) {
    console.info("Transaction completed Successfully!");
    console.log(t);
    console.log(r);
}


function init(callback) {
    let selectQuery = `Select ii.item_id ,i.customer_name , i.type, i.date, d.name, ii.quantity, d.price, ii.type as return_sell 
    From Inovice i, Items d, inovice_Items ii 
    Where i.id =${inoviceId} AND ii.inovice_id = i.id AND d.id = ii.item_id `;

    db.transaction(function (tx) {
        tx.executeSql(selectQuery, [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;

            const customerName = sqlResultSet.rows[0].customer_name;
            const inoviceType = sqlResultSet.rows[0].type;
            const inoviceDate = sqlResultSet.rows[0].date;

            customer_nameEl.setAttribute('value', customerName);
            inovice_typeEl.setAttribute('value', inoviceType)
            inovice_dateEl.setAttribute('value', inoviceDate)
            for (var i = 0; i < len; i++) {
                var cur_item = rows[i];
                var newRow = tableBody.insertRow(-1);
                newRow.setAttribute('id', cur_item.item_id);

                var idCell = newRow.insertCell(0);
                var drugNameCell = newRow.insertCell(1);
                var quantityCell = newRow.insertCell(2);
                var unitPriceCell = newRow.insertCell(3);
                var totalPriceCell = newRow.insertCell(4);
                var sell_returnCell = newRow.insertCell(5);

                // name, quantity, price, return_sell
                var total = cur_item.quantity * cur_item.price;
                inoviceTotalPrice += total;
                inoviceTotalItems += cur_item.quantity;

                var id = document.createTextNode(i + 1);
                var drugName = document.createTextNode(cur_item.name);
                var quantity = document.createTextNode(cur_item.quantity);
                var unitPrice = document.createTextNode("$" + cur_item.price);
                var totalPrice = document.createTextNode("$" + total);
                var sell_return = document.createTextNode(cur_item.return_sell);

                idCell.appendChild(id)
                drugNameCell.appendChild(drugName);
                quantityCell.appendChild(quantity);
                totalPriceCell.appendChild(totalPrice);
                unitPriceCell.appendChild(unitPrice);
                sell_returnCell.appendChild(sell_return)
            }
            inovice_total_itemsEl.setAttribute('value', inoviceTotalItems);
            inovice_total_moneyEl.setAttribute('value', inoviceTotalPrice);
            inovice_paidEl.setAttribute('value', inoviceTotalPrice);
        }, function (sqlTransaction, sqlError) {
            switch (sqlError.code) {
                case sqlError.SYNTAX_ERR:
                    console.error("Syntax error has occurred. " + sqlError.message);
                    break;
                default:
                    console.error("Other error");
            }
        });

    }, transError, getRows);

    loadDropdownData();
}

function loadDropdownData() {
    let selectQuery = `select id, name from items`;
    db.transaction(function (tx) {
        tx.executeSql(selectQuery, [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;

            for (var i = 0; i < len; i++) {
                var cur_item = rows[i];
                var option = document.createElement('A');
                var optionName = document.createTextNode(cur_item.name);
                option.href = '';
                option.setAttribute('class', "dropdown-item");
                option.id = cur_item.id;
                option.appendChild(optionName);
                items_dropdownEl.appendChild(option);
            }
        }, function (sqlTransaction, sqlError) {
            switch (sqlError.code) {
                case sqlError.SYNTAX_ERR:
                    console.error("Syntax error has occurred. " + sqlError.message);
                    break;
                default:
                    console.error("Other error");
            }
        });
    }, transError, selectDropdownItem);
}

// filter dropdown items
item_searchEl.addEventListener('keyup', filterFunction);
function filterFunction() {
    var filter, i;
    // item_searchEl
    var options = items_dropdownEl.getElementsByTagName('a');
    filter = item_searchEl.value.toUpperCase();

    for (i = 0; i < options.length; i++) {
        txtValue = options[i].textContent || options[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}

// add onclick event for each row in the inovice items.
function getRows() {
    var rows = document.getElementsByTagName('tr');
    if (rows) {
        for (var i = 1; i < rows.length; i++) {
            rows[i].setAttribute('onclick', 'getId(this)');
        }
    }
}
// display selected item.
function selectDropdownItem() {
    var options = items_dropdownEl.getElementsByTagName('a');
    if (options) {
        for (let i = 0; i < options.length; i++) {
            const element = options[i];
            element.addEventListener("click", function (event) {
                event.preventDefault();
                drug_nameEl.value = element.text;
            });
        }
    }
}


// check if there is unsaved update
function checkIfUnsavedUpdate() {
    if (drug_nameEl.value && drug_quantityEl.value && drug_typeEl.value) return true;
    else return false;
}

function replaceData(row) {

    var index = row.rowIndex;

    var dName = tableBody.rows[index - 1].cells[1].innerHTML;
    var dQuantity = tableBody.rows[index - 1].cells[2].innerHTML;
    var dType = tableBody.rows[index - 1].cells[5].innerHTML;

    drug_nameEl.setAttribute('value', dName);
    drug_quantityEl.setAttribute('value', dQuantity);
    drug_typeEl.setAttribute('value', dType);
}

function getId(row) {
    // var itemId = row.getAttribute('id');

    // check if there is selected drug
    if (checkIfUnsavedUpdate()) {
        const confirmMessage = "there is already choosen item. Do you want to change and lose all the updates?";
        confirm(confirmMessage) ? replaceData(row) : 0;
    }
    else replaceData(row);
}

// Add or update Item in inovice
btnAddItem.addEventListener('click', addItem);
function addItem(){
    let drug_name = drug_nameEl.value
    let ordered_quantity = drug_quantityEl.value;
    let operation_type = drug_typeEl.value;
    if (drug_name && ordered_quantity && operation_type) {
        // 
    }
}

/*
    TODO:- handel cancelInovice Button
    - when page load :- make copy of the inovice
    ---------------------
    - add/update inovice item :- if btn.text = add -> addNewItem();
    - else updateExistingItem();
    - addNewItem :- select id, quantity from items where name ='selected'
                    if(type = sell){
                        if( item_quantity < ordered_quantity ) 
                            alert("No more than ${item_quantity} in the stock");
                        else {
                            insert into inovice_items values(inovice_id,item_id,type,quantity)
                            update items set quantity -= ordered where id = item_id
                            alert("added Succesfully");
                            init(getRows);
                        }
                    }else{
                        // type = buy
                        insert into inovice_items values(inovice_id,item_id,type,quantity)
                            update items set quantity += ordered where id = item_id
                            alert("added Succesfully");
                            init(getRows);
                    }
    - updateItem:- make drug_name disabled
                   select id, quantity from items where name ='selected'
                   select type, quantity from inovice_items 
                   where item_id = item_id AND inovice_id = inovice_id
                   if(oldType = newType && oldType = 'sell'){
                       difference = new-old;
                       if(difference = 0) init(getRows);
                       else if(difference >0){
                           if( item_quantity < difference ) 
                                alert("No more than ${item_quantity+old} in the stock");
                           else {
                               update inovice_items set quantity = new 
                               where item_id = item_id AND inovice_id = inovice_id
                               update items set quantity -= difference where item_id = item_id
                               alert("updated Successfully!");
                               init(getRows); 
                           }
                       }
                    }else if(oldType = newType && oldType = 'buy'){
                       difference = new-old;
                       if(difference = 0) init(getRows);
                       else if(difference >0){
                           if( item_quantity < difference ) 
                               update inovice_items set quantity = new 
                               where item_id = item_id AND inovice_id = inovice_id
                               update items set quantity += difference where item_id = item_id
                               alert("updated Successfully!");
                               init(getRows); 
                           else {
                               alert("Cant complete operation! updating this ite will result a negative number in quantity which is not logical");     
                           }
                       }
                    }
*/

// delete item from inovice
btnDeleteItem.addEventListener('click',deleteItem);
function deleteItem(){

}

// cancel updates and load inovice items
btnCancelItem.addEventListener('click',cancelItemChanges);
function cancelItemChanges(){

}


// save Inovice items
btnSaveInovice.addEventListener('click',saveInovice);
function saveInovice(){

}

// cancel changes made in inovice
btnCancelInovice.addEventListener('click',cancelInoviceChanges);
function cancelInoviceChanges(){

}

// delete inovice
btnDeleteInovice.addEventListener('click',deleteInovice);
function deleteInovice(){

}