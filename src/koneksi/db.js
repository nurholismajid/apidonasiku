var mysql = require('mysql');
var koneksi = mysql.createConnection({
    host: '192.168.10.218',
    user: 'olis',
    password: 'olis121m',
    database: 'donasiku'
});
koneksi.connect(function(err) {
    if (err) throw err;
    console.log("terkoneksi");
});

module.exports = koneksi;