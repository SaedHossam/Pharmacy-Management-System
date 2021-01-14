var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log("Database opened Successfully! Or created for the first time !");
});

// get item id
var itemId = document.location.search.replace(/^.*?\=/, '');

init();

const idEl = document.getElementById('item-id');
const nameEl = document.getElementById('item-name');
const quantityEl = document.getElementById('item-quantity');
const priceEl = document.getElementById('item-price');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnDelete = document.getElementById('btn-delete');
const itemImageEl = document.getElementById('item-image');

const imageFile = document.getElementById('imgFile');
const imagePreview = document.getElementById('imgPreview');

imageFile.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function () {

            itemImageEl.setAttribute('src', this.result);
        });
        reader.readAsDataURL(file);
    }
});


var id = idEl.value;
var itemName = nameEl.value;
var price = priceEl.value;
var quantity = quantityEl.value;
var itemImage = itemImageEl.getAttribute('src');

nameEl.setAttribute('onkeyup', 'updateName()');
priceEl.setAttribute('onkeyup', 'updatePrice()');
quantityEl.setAttribute('onkeyup', 'updateQuantity()');

function updateName() {
    itemName = nameEl.value;
}

function updatePrice() {
    price = priceEl.value;
}

function updateQuantity() {
    quantity = quantityEl.value;
}

// DB error handle
function transError(t, e) {
    console.log(t);
    console.log(e);
    console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}

// if success
function transSuccess(t, r) {

    // console.info("Transaction completed Successfully!");
    // console.log(t);
    // console.log(r);
}


// set values of selected item
function init() {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM items where id =" + itemId, [], function (sqlTransaction, sqlResultSet) {
            row = sqlResultSet.rows;
            idEl.setAttribute('value', row[0].id);
            nameEl.setAttribute('value', row[0].name);
            priceEl.setAttribute('value', row[0].price);
            quantityEl.setAttribute('value', row[0].quantity);
            itemImageEl.setAttribute('src', row[0].picture)
        }, function (sqlTransaction, sqlError) {
            switch (sqlError.code) {
                case sqlError.SYNTAX_ERR:
                    console.error("Syntax error has occurred. " + sqlError.message);
                    break;
                default:
                    console.error("Other error");
            }
        });
    }, transError, transSuccess);
}

btnSave.setAttribute('onclick', 'updateItem()')

// update item with new values 
function updateItem(id, itemName, quantity, price) {
    id = idEl.value;
    itemName = nameEl.value;
    price = priceEl.value;
    quantity = quantityEl.value;
    itemImage = itemImageEl.getAttribute('src');
    if (id && itemName && quantity && price && itemImage) {
        var updateQuery = `update items set name = '${itemName}', price=${price}, quantity=${quantity}, picture ='${itemImage}' where id = ${id}`;
        db.transaction(function (tx) {
            tx.executeSql(updateQuery, [], function (transaction, result) {
            }, function (transaction, error) {
                console.log(error);
            });
        }, transError, showSuccess());
    }
    else{
        alert("Please Fill All Records!!");
    }
}

function showSuccess(id) {
    alert('Updated Successfully');
    window.document.location = '../html/items.html';
}

btnCancel.setAttribute('onclick', 'cancel()');

function cancel() {
    askQuestion('Are you sure you want to cancel updates?', yes, no);
}

function askQuestion(question, onOK, onCancel) {
    const answer = confirm(question);

    answer ? onOK() : onCancel();
}

function yes() {
    window.document.location = '../html/items.html';
}
function no() {
    init();
}

btnDelete.setAttribute('onclick', 'deleteItem()');

function deleteItem() {
    id = idEl.value;
    itemName = nameEl.value;
    const answer =
        confirm("You are going to delete this item =>" + itemName + ", are you sure?");
    answer ? forceDelete(id) : 0;
}


function forceDelete(id) {
    db.transaction(function (tx) {
        tx.executeSql('delete from items where id=?', [id], function (transaction, result) {
            console.log(result);
            alert('Record Deleted Successfully!');
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
    window.document.location = '../html/items.html';
}
//