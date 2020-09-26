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

router.get('/donasi', (req, res, next) => {
    var sql = "SELECT donasis.id_donasi, donasis.nominal_donasi,donasis.tanggal_transfer,donasis.bukti_transfer, donasis.status, donaturs.id_donatur, donaturs.nama_donatur, penerimas.id_penerima, penerimas.nama_penerima FROM donasis INNER JOIN donaturs ON donaturs.id_donatur = donasis.id_donatur INNER JOIN penerimas ON penerimas.id_penerima = donasis.id_penerima where donasis.status ='Sudah Dikonfirmasi' AND donasis.delete_at is null ORDER BY donasis.id_donasi DESC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});


module.exports = router