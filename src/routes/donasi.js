const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
const dateFormat = require('dateformat');
const timestamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
const path = require('path');
const fs = require('fs');
router.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: true
}));
router.use(bodyparser.json({ limit: "50mb" }));

router.get('/', (req, res, next) => {
    var sql = "SELECT donasis.id_donasi, donasis.nominal_donasi,donasis.tanggal_transfer,donasis.bukti_transfer, donasis.status, donaturs.id_donatur, donaturs.nama_donatur, penerimas.id_penerima, penerimas.nama_penerima FROM donasis INNER JOIN donaturs ON donaturs.id_donatur = donasis.id_donatur INNER JOIN penerimas ON penerimas.id_penerima = donasis.id_penerima where donasis.delete_at is null ORDER BY donasis.id_donasi DESC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});


router.post('/create', (req, res, next) => {
    if (req.body.iddonatur != "" && req.body.idpenerima != "" && req.body.nominal != "" && req.body.tanggal != "" && req.body.foto != "" && req.body.typefile != "") {
       
                    var urlfoto = "http://192.168.10.218:8080/images/donasis/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/donasis/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO donasis (id_donasi, id_donatur, id_penerima, nominal_donasi, tanggal_transfer, bukti_transfer,status, create_at) values ("${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}","${req.body.iddonatur}","${req.body.idpenerima}","${req.body.nominal}","${req.body.tanggal}","${urlfoto+namefoto}","Menunggu Konfirmasi","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan" });
                    })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});



router.delete('/delete/:id', (req, res, next) => {
    var sql = `UPDATE donasis SET delete_at = "${timestamp}" where id_donasi = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});


router.put('/status/:id',(req, res, next) =>{

    var sql = `UPDATE donasis SET status = "${req.body.status}" where id_donasi = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
        }
        var sql = `SELECT donasis.id_donasi, donasis.nominal_donasi, donasis.tanggal_transfer,donasis.bukti_transfer, donasis.status, donaturs.id_donatur, donaturs.nama_donatur, penerimas.id_penerima, penerimas.nama_penerima FROM donasis INNER JOIN donaturs ON donaturs.id_donatur = donasis.id_donatur INNER JOIN penerimas ON penerimas.id_penerima = donasis.id_penerima where donasis.id_donasi = "${req.params.id}" and donasis.delete_at is null ORDER BY donasis.id_donasi DESC`;
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.status(500).send({ status: "failed", message: "gagal mengambil data" });
            }
            res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
        })
    })

})

module.exports = router