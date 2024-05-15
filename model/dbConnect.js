const mysql = require("mysql2");

var dbConnect = {
    getConnection: () => {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "12345",
            database: "spgames"
        })

        return conn;
    }
}

module.exports = dbConnect;