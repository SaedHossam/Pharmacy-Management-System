const tableBody = document.getElementById("t-body");

var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
  console.log(db);
  console.log("Database opened Successfully! Or created for the first time !");
  createTable(db);
});

const btnNewUser = document.getElementById('btn-newUser');

btnNewUser.setAttribute('onclick','createNewUser()');

function createNewUser(){
  //btnNewUser.preventDefault();
  let lastRow = document.getElementById('t-body').rows.length;
  window.document.location = '../html/new-user.html?user-id=' +lastRow;
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
    tx.executeSql("SELECT * FROM users", [], function (sqlTransaction, sqlResultSet) {
      var rows = sqlResultSet.rows;
      var len = rows.length;
      for (var i = 0; i < len; i++) {
        var cur_item = rows[i];
        var newRow = tableBody.insertRow(-1);
        newRow.setAttribute('id', cur_item.id);

        var idCell = newRow.insertCell(0);
        var nameCell = newRow.insertCell(1);
        var emailCell = newRow.insertCell(2);
        var typeCell = newRow.insertCell(3);

        var id = document.createTextNode(i + 1);
        var userName = document.createTextNode(cur_item.name);
        var email = document.createTextNode(cur_item.email);
        var type = document.createTextNode(cur_item.type);

        idCell.appendChild(id)
        nameCell.appendChild(userName);
        emailCell.appendChild(email);
        typeCell.appendChild(type);
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
  window.document.location = '../html/edit-user.html?item-id=' + id;
}

