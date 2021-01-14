var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log("Database opened Successfully! Or created for the first time !");
});

// get item id
var userId = document.location.search.replace(/^.*?\=/, '');

init();

const idEl = document.getElementById('userId');
const nameEl = document.getElementById('userName');
const emailEl = document.getElementById('userEmail');
const userTypeEl = document.getElementById('userType');
const passwordEl = document.getElementById('userPassword');

const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const btnDelete = document.getElementById('btn-delete');

var id = idEl.value;
var userName = nameEl.value;
var password = passwordEl.value;
var email = emailEl.value;
var userType = userTypeEl.value;

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
    let selectQuery = `SELECT * FROM users where id = ${userId}`;
    db.transaction(function (tx) {
        tx.executeSql(selectQuery, [], function (sqlTransaction, sqlResultSet) {
            row = sqlResultSet.rows;
            idEl.setAttribute('value', row[0].id);
            nameEl.setAttribute('value', row[0].name);
            passwordEl.setAttribute('value', row[0].password);
            emailEl.setAttribute('value', row[0].email);
            userTypeEl.setAttribute('value', row[0].type)
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

btnSave.setAttribute('onclick', 'updateUser()')

// update item with new values 
function updateUser(id, userName, email, password,userType) {
    id = idEl.value;
    userName = nameEl.value;
    password = passwordEl.value;
    email = emailEl.value;
    userType = userTypeEl.value;
    if (id && userName && email && password && userType) {
        var updateQuery = `update users set name = '${userName}', password=${password}, email=${email}, type ='${userType}' where id = ${id}`;
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
    window.document.location = '../html/users.html';
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
    window.document.location = '../html/users.html';
}
function no() {
    init();
}

btnDelete.setAttribute('onclick', 'deleteItem()');

function deleteItem() {
    id = idEl.value;
    userName = nameEl.value;
    const answer =
        confirm("You are going to delete this user =>" + userName + ", are you sure?");
    answer ? forceDelete(id) : 0;
}


function forceDelete(id) {
    let deleteQuerey = `delete from users where id=${id}`
    db.transaction(function (tx) {
        tx.executeSql(deleteQuerey, [], function (transaction, result) {
            console.log(result);
            alert('Record Deleted Successfully!');
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
    window.document.location = '../html/users.html';
}
