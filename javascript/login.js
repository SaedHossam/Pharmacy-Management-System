var db = openDatabase('Pharmacy', '1.0', 'Pharmacy System', 5 * 1024 * 1024, function (db) {
    console.log(db);
    console.log("Database opened Successfully! Or created for the first time !");
    createTable(db);
});

var btn = document.getElementById("btnLogin");

function validate() {
    var username = document.getElementById("exampleInputEmail1").value;
    var password = document.getElementById("exampleInputPassword1").value;
    if (username == "admin@gmail.com" && password == "1234") {
        window.location.href = './home.html';
        return false;
    }else alert("Wrong Email or Password");
}

btn.addEventListener("click", function(event){
    event.preventDefault();
    validate();
  });