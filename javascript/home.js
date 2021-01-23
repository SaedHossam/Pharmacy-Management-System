// Create DB

let username = document.location.search.replace(/^.*?\=/, '');
if(!username) window.location.href = `./html/login.html`;
let Username = document.getElementById("name");
Username.innerText = `Welcome Back, ${username}`;
var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

// ********************** Create Tables ************************** \\

// USERS(id,name,email,password,type)
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users(id int primary key , name text , email text , password text , type text)', [], function (transaction, result) {
        console.log(result);
        console.log('Table created Successfully!');
        //insertRecords(db);
    }, function (transaction, error) {
        console.log(error);
    });
}, transError, transSuccess);

//ITEMS(id,name,quantity,price,picture)
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS items(id int primary key , name text , quantity int , price int , picture text)', [], function (transaction, result) {
        console.log(result);
        console.log('Table created Successfully!');
        //insertRecords(db);
    }, function (transaction, error) {
        console.log(error);
    });
}, transError, transSuccess);

//INOVICES(id,customer_name,date,total_price,type)
db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS inovice(id int primary key , customer_name text , date text , type text , total_price int)", [], function (transaction, result) {
        console.log(result);
        console.log('Table created Successfully!');
        //insertRecords(db);
    }, function (transaction, error) {
        console.log(error);
    });
}, transError, transSuccess);

//INOVICE_ITEMS(inovice_id,item_id,type)
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS inovice_items(inovice_id int , item_id int , type text, quantity int, '
        + ' FOREIGN KEY (inovice_id) REFERENCES inovice(id), FOREIGN KEY (item_id) REFERENCES items(id)' +
        'FOREIGN KEY (item_id) REFERENCES items(id) )', [], function (transaction, result) {
            console.log(result);
            console.log('Table created Successfully!');
            //insertRecords(db);
        }, function (transaction, error) {
            console.log(error);
        });
}, transError, transSuccess);

// Error Handling
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

/********************* Inserting records **************************/
/*
if (db) {
    // inserting users
    db.transaction(function (tx) {
        tx.executeSql('insert into users(id,name , email , password, type)' +
            'values(?,?,?,?,?)',
            [1,"admin", "admin@gmail.com", 1234,"Admin"]
            , function (transaction, result) {
                console.log(result.insertId);
            }, function (transaction, error) {
                console.log(error);
            });
    }, transError, transSuccess);

} else {
    createDb();
}
*/