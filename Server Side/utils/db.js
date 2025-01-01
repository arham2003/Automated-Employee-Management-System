import mysql from 'mysql';

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employeems01",
    port: 3377  // Specify the correct port
});

con.connect(function(err) {
    if (err) {
        console.error("Connection error: ", err);
    } else {
        console.log("Connected");
    }
});

export default con;
