
const tableBody = document.getElementById("t-body");

var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});
// Error Handling
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

init(getRows);


// ********** Update ************
/*
db.transaction(function (tx) {
    tx.executeSql('update inovice set id=? where date = "09-01-2020"', [4], function (transaction, result) {
        console.log(result);
        console.info('Record Updated Successfully!');
        
    }, function (transaction, error) {
        console.log(error);
    });
}, transError, transSuccess);
*/
// ************* Delete ****************
/*
db.transaction(function (tx) {
    tx.executeSql('delete from inovice where id=?', [4], function (transaction, result) {
        console.log(result);
        console.info('Record Deleted Successfully!');
    }, function (transaction, error) {
        console.log(error);
    });
}, transError, transSuccess);
*/
// ******** Select *********** 
// inovice(id,customer_name, date, type, total_price)
// (cur_item.id,cur_item.customer_name,cur_item.date,cur_item.type,cur_item.total_price)
function init(callback) {
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM inovice", [], function (sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            for (var i = 0; i < len; i++) {
                var cur_item = rows[i]; // or u can use the item methid ---> var cur_item = rows.item(i);
                var newRow = tableBody.insertRow(-1);
                newRow.setAttribute('id', cur_item.id);

                var idCell = newRow.insertCell(0);
                var nameCell = newRow.insertCell(1);
                var dateCell = newRow.insertCell(2);
                var typeCell = newRow.insertCell(3);
                var priceCell = newRow.insertCell(4);

                var id = document.createTextNode(i + 1);
                var customerName = document.createTextNode(cur_item.customer_name);
                var date = document.createTextNode(cur_item.date);
                var price = document.createTextNode(cur_item.type);
                var type = document.createTextNode("$" + cur_item.total_price);

                idCell.appendChild(id)
                nameCell.appendChild(customerName);
                dateCell.appendChild(date);
                priceCell.appendChild(price);
                typeCell.appendChild(type);
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
    }, transError, getRows);
}

function getRows() {
    var rows = document.getElementsByTagName('tr');
    if (rows) {
        for (var i = 1; i < rows.length; i++) {
            rows[i].setAttribute('onclick', 'getId(this)');
        }
    }
}

function getId(row) {
    var id = row.getAttribute('id');
    window.document.location = '../html/edit-inovice.html?inovice-id=' + id;
}