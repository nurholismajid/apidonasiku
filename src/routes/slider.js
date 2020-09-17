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

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id, title, description, url, cover, category FROM sliders where category = "${req.params.id}" AND delete_at is null ORDER BY id DESC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.category != "" && req.body.foto != "" && req.body.typefile != "") {
                    var urlfoto = "http://192.168.42.232:8080/images/sliders/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/sliders/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO sliders (title, description, category, url, cover, create_at) values ("${req.body.title}","${req.body.description}", "${req.body.category}", "${req.body.url}", "${urlfoto+namefoto}","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: { title: req.body.title, description: req.body.description,url: req.body.url , category: req.body.category, cover: urlfoto + namefoto } });
                    })
                
    } else {
        res.status(200).send({ status: "failed", message: "Wajib mengisi cover slider" });
    }
});



router.delete('/delete/:id', (req, res, next) => {
    var sql = `UPDATE sliders SET delete_at = "${timestamp}" where id = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});

module.exports = router