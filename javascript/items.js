const tableBody = document.getElementById("t-body");

var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
  console.log(db);
  console.log("Database opened Successfully! Or created for the first time !");
  createTable(db);
});

const btnNewItem = document.getElementById('btn-newItem');

btnNewItem.setAttribute('onclick', 'createNewItem()');

function createNewItem() {
  //btnNewItem.preventDefault();
  let lastRow = document.getElementById('t-body').rows.length;
  window.document.location = '../html/new-item.html?item-id=' + lastRow;
}
// Error Handling
function transError(t, e) {
  console.log(t);
  console.log(e);
  console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}

init(getRows);

// select all items from DB, add to table-body, then start.
function init(callback) {
  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM items", [], function (sqlTransaction, sqlResultSet) {
      var rows = sqlResultSet.rows;
      var len = rows.length;
      for (var i = 0; i < len; i++) {
        var cur_item = rows[i];
        var newRow = tableBody.insertRow(-1);
        newRow.setAttribute('id', cur_item.id);

        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var quantityCell = newRow.insertCell(2);
        var priceCell = newRow.insertCell(3);

        var id = document.createTextNode(i + 1);
        var itemName = document.createTextNode(cur_item.name);
        var quantity = document.createTextNode(cur_item.quantity);
        var price = document.createTextNode("$" + cur_item.price);

        idCell.appendChild(id)
        nameCell.appendChild(itemName);
        quantityCell.appendChild(quantity);
        priceCell.appendChild(price);
      }
      //console.log('Done!!!');
    }, function (sqlTransaction, sqlError) {
      switch (sqlError.code) {
        case sqlError.SYNTAX_ERR:
          console.error("Syntax error has occurred. " + sqlError.message);
          break;
        default:
          console.error("Other error");
      }
    });
  }, transError, callback);
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
  window.document.location = '../html/edit-item.html?item-id=' + id;
}
