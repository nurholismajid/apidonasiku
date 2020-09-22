require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
const path = require('path');
const fs = require('fs');
router.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: true
}));
router.use(bodyparser.json({ limit: "50mb" }));

router.get('/', (req, res, next) => {
    var sql = "SELECT id, name_web, logo_web, description_web, address_web, email_web, phone_web, facebook, instagram, youtube FROM options";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.put('/update/:id', (req, res, next) => {
    if (req.body.nama != "" && req.body.deskripsi != "" && req.body.alamat != "" && req.body.email != "" && req.body.nohp != "" && req.body.facebook != "" && req.body.instagram != "" && req.body.youtube != "" ) {       
                        if (req.body.foto != "" && req.body.fotolama != "") {

                            var fotolama = req.body.fotolama.slice(42);
                            var pathfotolama = path.join(__dirname, '../../public/images/options/') + fotolama;

                            fs.unlink(pathfotolama, function(err) {
                                console.log(err);
                            });

                            var urlfoto = "http://192.168.10.203:8080/images/options/";
                            var namefoto = Date.now() + req.body.typefile;
                            var pathimg = path.join(__dirname, '../../public/images/options/') + namefoto;
                            var imgdata = req.body.foto;
                            var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                            fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                                console.log(err);
                            });

                            var sql = `UPDATE options SET name_web = "${req.body.nama}" , description_web = "${req.body.deskripsi}" ,address_web = "${req.body.alamat}" ,email_web = "${req.body.email}" ,phone_web = "${req.body.nohp}" , facebook = "${req.body.facebook}" , instagram = "${req.body.instagram}" , youtube = "${req.body.youtube}" , logo_web = "${urlfoto+namefoto}" where id = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id, name_web, logo_web FROM options where id = "${req.params.id}" `;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        } else {
                            var sql = `UPDATE options SET name_web = "${req.body.nama}" , description_web = "${req.body.deskripsi}" ,address_web = "${req.body.alamat}" ,email_web = "${req.body.email}" ,phone_web = "${req.body.nohp}" , facebook = "${req.body.facebook}" , instagram = "${req.body.instagram}" , youtube = "${req.body.youtube}" where id = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id, name_web, logo_web FROM options where id = "${req.params.id}" `;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        }          

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});



module.exports = router