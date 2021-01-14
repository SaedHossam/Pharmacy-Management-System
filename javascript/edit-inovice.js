
var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});


let inoviceId = document.location.search.replace(/^.*?\=/, '');
if (!inoviceId) location.href = '../html/inovices.html';

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
const btnDeleteInovice = document.getElementById('delete');

let inoviceTotalItems = 0;
let inoviceTotalPrice = 0;
let paid = 0;
let itemsList = [];
let itemsIdList = [];
let itemsQuantityList = [];
let itemsPriceList = [];


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
    
    let selectInoviceInfo = `select * from inovice where id =${inoviceId}`;
   
    let selectQuery = `Select ii.item_id ,i.customer_name , i.type, i.date, d.name, ii.quantity, d.price, ii.type as return_sell 
    From Inovice i, Items d, inovice_Items ii 
    Where i.id =${inoviceId} AND ii.inovice_id = i.id AND d.id = ii.item_id `;


    db.transaction(function (tx) {

        tx.executeSql(selectInoviceInfo, [], function (transaction, result) {
            var rows = result.rows;
            //var len = rows.length;
    
            const customerName = result.rows[0].customer_name;
            const inoviceType = result.rows[0].type;
            const inoviceDate = result.rows[0].date;
    
            customer_nameEl.setAttribute('value', customerName);
            inovice_typeEl.setAttribute('value', inoviceType);
            inovice_dateEl.setAttribute('value', inoviceDate);
        }, function (transaction, error) {
            console.log(error);
        });

    tx.executeSql(selectQuery, [], function (sqlTransaction, sqlResultSet) {
        var rows = sqlResultSet.rows;
        var len = rows.length;

        // const customerName = sqlResultSet.rows[0].customer_name;
        // const inoviceType = sqlResultSet.rows[0].type;
        // const inoviceDate = sqlResultSet.rows[0].date;

        // customer_nameEl.setAttribute('value', customerName);
        // inovice_typeEl.setAttribute('value', inoviceType)
        // inovice_dateEl.setAttribute('value', inoviceDate)
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
            if (cur_item.return_sell == 'sell')
                inoviceTotalPrice += total;
            else inoviceTotalPrice -= total;

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

        let updateInovice = `update inovice set total_price =
            ${inoviceTotalPrice} where id =${inoviceId}`;
        executeSqlQuery(updateInovice);

    }, function (sqlTransaction, sqlError) {
        switch (sqlError.code) {
            case sqlError.SYNTAX_ERR:
                console.error("Syntax error has occurred. " + sqlError.message);
                break;
            default:
                console.error("Other error");
        }
    });

}, transError, callback);

loadDropdownData();
}

function loadDropdownData() {
    let selectQuery = `select id, name, quantity, price from items`;
    db.transaction(function (tx) {
        tx.executeSql(selectQuery, [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;

            for (var i = 0; i < len; i++) {
                var cur_item = rows[i];
                itemsIdList.push(cur_item.id);
                itemsList.push(cur_item.name);
                itemsQuantityList.push(cur_item.quantity);
                itemsPriceList.push(cur_item.price);

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
let oldQuantity = null;
function replaceData(row) {

    var index = row.rowIndex;

    var dName = tableBody.rows[index - 1].cells[1].innerHTML;
    var dQuantity = tableBody.rows[index - 1].cells[2].innerHTML;
    var dType = tableBody.rows[index - 1].cells[5].innerHTML;
    oldQuantity = dQuantity;

    drug_nameEl.setAttribute('value', dName);
    drug_quantityEl.setAttribute('value', dQuantity);
    drug_typeEl.setAttribute('value', dType);
    drug_typeEl.selectedIndex = dType == 'sell' ? 0 : 1;

    drug_nameEl.setAttribute('disabled', true);
    drug_typeEl.setAttribute('disabled', true);
    btnAddItem.innerHTML = "Update";
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
function addItem() {
    //console.log(itemsList);
    let avq = 0;
    let itemID = 0;
    let itemPrice = 0;
    let itemName = drug_nameEl.value;
    let quantity = drug_quantityEl.value;
    let type = drug_typeEl.value;
    //console.log(type);
    if (!itemName || !quantity || !type || itemName == 'select' || quantity <= 0) {
        alert('Messing some required values or wrong input values! /n' +
            ' you may not select a drug or entered quantity <= 0!');
    }
    else {

        // get avalible quantity and item id
        for (let i = 0; i < itemsList.length; i++) {
            if (itemName == itemsList[i]) {
                avq = itemsQuantityList[i];
                itemID = itemsIdList[i];
                itemPrice = itemsPriceList[i];
                break;
            }
        }

        // adding new item
        if (btnAddItem.innerHTML == "Add") {
            if (type == 'sell') {
                // check if avalible less than ordered
                if (avq < quantity) {
                    alert("There is no avalible quantity of this item");
                }
                else {
                    addToInovice(itemID, quantity, type, -1, itemPrice);
                }
            } else {
                // type = buy
                addToInovice(itemID, quantity, type, 1, itemPrice);
            }
        }
        else {
            // updating existing item
            // update Inovice_items
            let diff = quantity - oldQuantity;
            //console.log(diff);
            let updateQuery = `UPDATE inovice_items 
            set quantity =${quantity} where inovice_id =${inoviceId} 
            AND item_id =${itemID} AND type ='${type}' 
            AND quantity =${oldQuantity}`;

            // check if there is avalible quantity
            if (((diff > 0 && type == 'sell') || (diff < 0 && type == 'buy')) && (avq < Math.abs(diff))) {

                alert(`There is no avalible quantity of this item ${diff}`);
            } else {
                diff = type == 'sell' ? -1 * diff : diff;

                let updateItemQuery = `UPDATE items set quantity =
                quantity + ${diff} WHERE id = ${itemID}`;
                console.log(itemID);
                executeSqlQuery(updateQuery);
                executeSqlQuery(updateItemQuery);
                refresh();
            }
        }
    }
}

// add the item in the inovice , update quantity in items, update total in inovice
function addToInovice(itemID, quantity, type, sign, itemPrice) {

    let insertQuery = `INSERT INTO inovice_items 
    VALUES (${inoviceId}, ${itemID}, '${type}', ${quantity})`;
    console.log(insertQuery);
    let updateItemsQuery = `UPDATE items set quantity = quantity + ${sign * quantity}
                       WHERE id = ${itemID}`;


    executeSqlQuery(insertQuery);
    executeSqlQuery(updateItemsQuery);

    refresh();
}

function executeSqlQuery(sqlQuery) {
    db.transaction(function (tx) {
        tx.executeSql(sqlQuery, [], function (transaction, result) {
            console.log(result);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}

function refresh() {
    window.document.location = '../html/edit-inovice.html?inovice-id=' + inoviceId;
}

// delete item from inovice
btnDeleteItem.addEventListener('click', deleteItem);
function deleteItem() {
    let avq = 0;
    let itemID = 0;
    let itemPrice = 0;
    let itemName = drug_nameEl.value;
    let quantity = drug_quantityEl.value;
    let type = drug_typeEl.value;
    //console.log(type);
    if (quantity != oldQuantity) {
        alert("Can't Delete because Data changed(Quantity)");
    }
    else {
        // get avalible quantity and item id
        for (let i = 0; i < itemsList.length; i++) {
            if (itemName == itemsList[i]) {
                avq = itemsQuantityList[i];
                itemID = itemsIdList[i];
                itemPrice = itemsPriceList[i];
                break;
            }
        }
        if (type == 'buy') {
            if (quantity > avq) alert("Can't delete because there is no avalible quntity.");
            else {
                deleteItemAndUpdateInovice(itemID, type, quantity, -1);

            }
        }
        else {
            deleteItemAndUpdateInovice(itemID, type, quantity, 1);

        }
    }
    refresh();
}
function deleteItemAndUpdateInovice(itemID, type, quantity, sign) {
    if (!sign) sign = type == 'buy' ? -1 : 1;
    let deleteInovice_Item = `DELETE FROM inovice_items where 
     inovice_id=${inoviceId} AND item_id=${itemID} AND type='${type}' 
    AND quantity=${quantity}`;

    let updateItem = `update items set quantity = quantity + ${sign * quantity} 
    Where id =${itemID}`;

    executeSqlQuery(deleteInovice_Item);
    executeSqlQuery(updateItem);
}
// cancel updates and load inovice items
btnCancelItem.addEventListener('click', cancelItemChanges);
function cancelItemChanges() {
    confirm('All changes will be dismissed! Continue?') ? refresh() : 0;
}


// save Inovice items
btnSaveInovice.addEventListener('click', saveInovice);
function saveInovice() {
    let itemName = drug_nameEl.value;
    let quantity = drug_quantityEl.value;
    let type = drug_typeEl.value;
    //console.log(type);
    if (!quantity && itemName == 'select') {
        window.document.location = '../html/inovices.html';
    }
    else alert('Please save selected item first!');
}


// delete inovice
btnDeleteInovice.addEventListener('click', deleteInovice);
function deleteInovice() {

    if (confirm("Are You Sure You Want to DELETE?")) {
        var rows = document.getElementsByTagName('tr');
        if (rows) {
            for (var i = 1; i < rows.length; i++) {
                var itemId = rows[i].getAttribute('id');
                var dQuantity = tableBody.rows[i - 1].cells[2].innerHTML;
                var dType = tableBody.rows[i - 1].cells[5].innerHTML;
                deleteItemAndUpdateInovice(itemId, dType, dQuantity);
            }
        }
        let deleteInovice = `delete from inovice where id = ${inoviceId}`;
        executeSqlQuery(deleteInovice);
        window.document.location = '../html/inovices.html';
    }
}