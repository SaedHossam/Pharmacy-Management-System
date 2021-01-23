var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

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

var btn = document.getElementById("btnLogin");


function validate() {
    var username = document.getElementById("exampleInputEmail1").value;
    var password = document.getElementById("exampleInputPassword1").value;
    if (username && password) {
        let sqlQuery = `select name from users where email= '${username}' AND password =${password}`;
        db.transaction(function (tx) {
            tx.executeSql(sqlQuery, [], function (transaction, result) {
                var rows = result.rows;
                var len = rows.length;
                if(!len){
                    alert("Wrong Email or Password!");
                }else{
                    var cur_item = rows[0];
                    window.location.href = `./home.html?username=${cur_item.name}`;
                }
            }, function (transaction, error) {
                console.log(error);
            });
        }, function (sqlTransaction, sqlError) {
            switch (sqlError.code) {
                case sqlError.SYNTAX_ERR:
                    console.error("Syntax error has occurred. " + sqlError.message);
                    break;
                default:
                    console.error("Other error");
            }
        });
        
        // return false;
    } else alert("Missing Some Data");
}

btn.addEventListener("click", function (event) {
    event.preventDefault();
    validate();
});