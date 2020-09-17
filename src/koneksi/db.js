var mysql = require('mysql');
var koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'olis',
    password: 'olis121m',
    database: 'donasiku'
});
koneksi.connect(function(err) {
    if (err) throw err;
    console.log("terkoneksi");
});

module.exports = koneksi;