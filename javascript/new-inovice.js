var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});
let inoviceId = document.location.search.replace(/^.*?\=/, '');
const btnCreate = document.getElementById('create');
const customer_nameEl = document.getElementById('customerName');
const inovice_dateEl = document.getElementById('inoviceDate');
const inovice_typeEl = document.getElementById('inoviceType');

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

if (day <= 9) {
    day = `0${day.toString()}`;
}

if (month <= 9) {
    month = `0${month.toString()}`;
}
let today = year + "-" + month + "-" + day;
let customer_name="";
customer_nameEl.addEventListener('keyup', updateName);
function updateName(){
    customer_name = customer_nameEl.value;
}
let type = inovice_typeEl.value;

inovice_dateEl.setAttribute('value', today);

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

function executeSqlQuery(sqlQuery) {
    db.transaction(function (tx) {
        tx.executeSql(sqlQuery, [], function (transaction, result) {
            console.log(result);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}

btnCreate.addEventListener('click', addInovice);
function addInovice() {
    if (!customer_name || customer_name=='') alert("Enter Customer Name!");
    else {
        let query = `insert into inovice values(${inoviceId}, '${customer_name}' , '${today}' , '${type}' , 0)`;
        executeSqlQuery(query);
        window.document.location = '../html/edit-inovice.html?inovice-id=' + inoviceId;
    }
}