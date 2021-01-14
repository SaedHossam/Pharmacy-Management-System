var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

var lastItemId = Number(document.location.search.replace(/^.*?\=/, ''));
const nameEl = document.getElementById('itemName');
const priceEl = document.getElementById('itemPrice');
const quantityEl = document.getElementById('itemQuantity');
const itemImageEl = document.getElementById('item-image');

const imageFile = document.getElementById('imgFile');
const imagePreview = document.getElementById('imgPreview');

const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');
//const btnTakeImage = document.getElementById('btn-takeImage');

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

btnCancel.setAttribute('onclick', 'cancel()');

function cancel() {
    askQuestion('Are you sure you want to cancel?', yes, no);
}

function askQuestion(question, onOK, onCancel) {
    const answer = confirm(question);

    answer ? onOK() : onCancel();
}

function yes() {
    window.document.location = '../html/items.html';
}
function no() {
    // do nothing
}


btnAdd.setAttribute('onclick', 'addNewItem()');

function addNewItem() {
    let itemName = nameEl.value;
    let itemPrice = priceEl.value;
    let itemQuantity = quantityEl.value;
    let itemImage = itemImageEl.getAttribute('src');

    if (itemName && itemPrice && itemQuantity && itemImage) {
        insertItem(itemName, itemPrice, itemQuantity, itemImage);
    }
    else {
        alert("Please fill All Records!.");
    }
}

function insertItem(itemName, itemPrice, itemQuantity, itemImage) {
    let insertQuery = `INSERT into items (id , name , price , quantity , picture)
    values( ${++lastItemId} , '${itemName}' , ${itemPrice} ,${itemQuantity}, '${itemImage}' )`;

    db.transaction(function (tx) {
        tx.executeSql(insertQuery,
            []
            , function (transaction, result) {
                console.log(result.insertId);
            }, function (transaction, error) {
                console.log(error);
            });
    }, transError, addedSuccessfuly);
}

function addedSuccessfuly() {
    alert("New Item Added!");
    window.document.location = '../html/new-item.html?item-id=' + lastItemId;
}
