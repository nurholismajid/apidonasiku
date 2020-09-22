const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
const dateFormat = require('dateformat');
const timestamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
const md5 = require('md5');
const path = require('path');
const fs = require('fs');
router.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: true
}));
router.use(bodyparser.json({ limit: "50mb" }));
// router.use(bodyparser.urlencoded({extended:true}));

router.get('/penerima', (req, res, next) => {
    var sql = "SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas WHERE delete_at is null AND publish = 'publish' ORDER BY nama_penerima ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});



module.exports = router