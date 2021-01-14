var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});