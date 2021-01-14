// Create DB
var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

// ********************** Create Tables ************************** \\
/*
// USERS(id,name,email,password,type)
db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS users(id int primary key , name text , email text , password int , type text)', [], function (transaction, result) {
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
    tx.executeSql("CREATE TABLE IF NOT EXISTS inovice(id int primary key , customer_name text , date TIMESTAMP DEFAULT(datetime('now', 'localtime')) , type text , total_price int)", [], function (transaction, result) {
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
        + 'PRIMARY KEY(inovice_id, item_id), FOREIGN KEY (inovice_id) REFERENCES inovice(id),' +
        'FOREIGN KEY (item_id) REFERENCES items(id) )', [], function (transaction, result) {
            console.log(result);
            console.log('Table created Successfully!');
            //insertRecords(db);
        }, function (transaction, error) {
            console.log(error);
        });
}, transError, transSuccess);
*/
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
    //console.log("start Inserting records!");
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

        // inserting items
        tx.executeSql('insert into items(id,name , quantity , price, picture)' +
            ' values(?,?,?,?,?),(?,?,?,?,?)',
            [1,"panadol", 10, 10, "panadolImg",2,"catafast", 10, 1, "catafastImg"], function (transaction, result) {
                console.log(result.insertId);
            }, function (transaction, error) {
                console.log(error);
            });

        // inserting inovices
        tx.executeSql('insert into inovice(id,customer_name, date, type, total_price)' +
            ' values(?,?,?,?,?),(?,?,?,?,?)',
            [1,"Eslam", "09-01-2020", "sell", 200, 2,"Eslam", "08-01-2020", "sell", 200], function (transaction, result) {
                console.log(result.insertId);
                console.log('Record inserted Successfully!');

            }, function (transaction, error) {
                console.log(error);
            });
        //inserting inovice_items
        tx.executeSql('insert into inovice_items(inovice_id, item_id, type, quantity)' +
            ' values(?,?,?,?),(?,?,?,?)',
            [1, 1, "sell", 10, 1, 2, "sell", 10], function (transaction, result) {
                console.log(result.insertId);
                console.log('inovice_items Records inserted Successfully!');

            }, function (transaction, error) {
                console.log(error);
            });

    }, transError, transSuccess);

} else {
    console.log('No Database man! wait creating it for you!');
    createDb();
}
*/
// Select ITEMS(id,name,quantity,price,picture)
/*
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM items", [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            for (var i = 0; i < len; i++) {
                var cur_item = rows[i]; // or u can use the item methid ---> var cur_item = rows.item(i);
                console.log("the id is : " + cur_item.id + " the data is : " + cur_item.name
                + " the quantity is : "+cur_item.quantity
                + " the price is : "+cur_item.price
                + " the picture in : "+cur_item.picture
                );
            }
            console.log('Done!!!');
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
*/


/*
function createDb() {
    var db_name = 'Pharmacy';
    var db_version = '1.0';
    var db_describe = 'Pharmacy System';
    var db_size = 5 * 1024 * 1024;
    var db = openDatabase(db_name, db_version, db_describe, db_size, function (db) {
        console.log(db);
        console.log("Database opened Successfully! Or created for the first time !");
        createTable(db);
    });
}

            **************************************************

            function createTable(db) {
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS users(id int primary key , name text , email text , password int , type text)', [], function (transaction, result) {
            console.log(result);
            console.log('Table created Successfully!');
            insertRecords(db);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS items(id int primary key , name text , quantity int , price int , picture text)', [], function (transaction, result) {
            console.log(result);
            console.log('Table created Successfully!');
            insertRecords(db);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);

    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS inovice(id int primary key , customer_name text , date TIMESTAMP DEFAULT(datetime('now', 'localtime')) , type text , total_price int)", [], function (transaction, result) {
            console.log(result);
            console.log('Table created Successfully!');TIMESTAMP
            insertRecords(db);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS inovice_items(inovice_id int , item_id int , type text, '
            + 'PRIMARY KEY(inovice_id, item_id), FOREIGN KEY (inovice_id) REFERENCES inovice(id),' +
            'FOREIGN KEY (item_id) REFERENCES items(id) )', [], function (transaction, result) {
                console.log(result);
                console.log('Table created Successfully!');
                insertRecords(db);
            }, function (transaction, error) {
                console.log(error);
            });
    }, transError, transSuccess);
}
            ***************************************
function insertRecords(db) {
    //console.log("Inserting records!");
    if (db) {
        //console.log("start Inserting records!");
        db.transaction(function (tx) {
            tx.executeSql('insert into users(id,name , email , password, type)' +
                'values(?,?,?,?)',
                ["admin", "admin@gmail.com", 1234]
                , function (transaction, result) {
                    console.log(result.insertId);
                }, function (transaction, error) {
                    console.log(error);
                });

            tx.executeSql('insert into items(name , quantity , price, picture)'+
            ' values(?,?,?,?),(?,?,?,?)',
            ["panadol",10 , 10, "panadolImg","catafast",10 , 1, "catafastImg"], function (transaction, result) {
                console.log(result.insertId);
            }, function (transaction, error) {
                console.log(error);
            });
            tx.executeSql('insert into inovice(customer_name, date, type, total_price)'+
            ' values(?,?,?,?),(?,?,?,?)',
            ["Eslam", "09-01-2020", "sell", 200,"Eslam", "08-01-2020", "sell", 200], function (transaction, result) {
                console.log(result.insertId);
                console.log('Record inserted Successfully!');
                displayNotes(db);
            }, function (transaction, error) {
                console.log(error);
            });
        }, transError, transSuccess);
    } else {
        console.log('No Database man! wait creating it for you!');
        createDb();
    }
}

    *************************************************

    function displayNotes(db) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT id,data FROM notes", [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            for (var i = 0; i < len; i++) {
                var cur_item = rows[i]; // or u can use the item methid ---> var cur_item = rows.item(i);
                console.log("the id is : " + cur_item.id + " the data is : " + cur_item.data);
            }
            console.log('Done!!!');
            UpdateNote(db);
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

function UpdateNote(db) {
    db.transaction(function (tx) {
        tx.executeSql('update notes set data=? where id=?', ["rane", 1], function (transaction, result) {
            console.log(result);
            console.info('Record Updated Successfully!');
            deleteNote(db);
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}

function deleteNote(db) {
    db.transaction(function (tx) {
        tx.executeSql('delete from notes where id=?', [1], function (transaction, result) {
            console.log(result);
            console.info('Record Deleted Successfully!');
        }, function (transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}
*/
//createDb();