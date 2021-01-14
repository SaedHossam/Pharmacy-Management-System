var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

var lastUserId = Number(document.location.search.replace(/^.*?\=/, ''));
const idEl = document.getElementById('userId');
const nameEl = document.getElementById('userName');
const emailEl = document.getElementById('userEmail');
const typeEl = document.getElementById('userType');
const passwordEl = document.getElementById('userPassword');


const btnAdd = document.getElementById('btnAdd');
const btnCancel = document.getElementById('btnCancel');


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
    window.document.location = '../html/users.html';
}
function no() {
    // do nothing
}


btnAdd.setAttribute('onclick', 'addNewUser()');

function addNewUser() {
    let userName = nameEl.value;
    let userPassword = Number(passwordEl.value);
    let userEmail = emailEl.value;
    let userType = typeEl.value;

    if (userName && userPassword &&userEmail && userType) {
        insertUser(userName, userPassword, userEmail, userType);
    }
    else {
        alert("Please fill All Records!.");
    }
}

function insertUser(userName, userPassword, userEmail, userType) {
    let insertQuery = `INSERT into users (id , name , email , type , password)
    values( ${++lastUserId} , '${userName}' , '${userEmail}' , '${userType}' ,${userPassword} )`;

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
    alert("New User Added!");
    window.document.location = '../html/new-user.html?item-id=' + lastUserId;
}
