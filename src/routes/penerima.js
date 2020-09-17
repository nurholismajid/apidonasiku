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

router.get('/', (req, res, next) => {
    var sql = "SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas where delete_at is null ORDER BY nama_penerima ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas where id_penerima = "${req.params.id}" AND delete_at is null ORDER BY nama_penerima ASC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.nama != "" && req.body.nohp != "" && req.body.alamat != "" && req.body.biaya != "" && req.body.rincianbiaya != "" && req.body.foto != "" && req.body.typefile != "") {
                    var urlfoto = "http://192.168.42.232:8080/images/penerimas/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/penerimas/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO penerimas (id_penerima, nama_penerima, nohp_penerima, alamat_penerima, foto_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, create_at) values ("${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}","${req.body.nama}","${req.body.nohp}","${req.body.alamat}","${urlfoto+namefoto}","${req.body.biaya}","${req.body.rincianbiaya}","draf","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: { nama: req.body.nama, email: req.body.email, nohp: req.body.nohp, alamat: req.body.alamat, biaya: req.body.biaya, rincianbiaya: req.body.rincianbiaya, foto: urlfoto + namefoto } });
                    })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.put('/update/:id', (req, res, next) => {
    if (req.body.nama != "" && req.body.nohp != "" && req.body.alamat != "" && req.body.biaya != "" && req.body.rincianbiaya != "") {       
                        if (req.body.foto != "" && req.body.fotolama != "") {

                            var fotolama = req.body.fotolama.slice(44);
                            var pathfotolama = path.join(__dirname, '../../public/images/penerimas/') + fotolama;

                            fs.unlink(pathfotolama, function(err) {
                                console.log(err);
                            });

                            var urlfoto = "http://192.168.42.232:8080/images/penerimas/";
                            var namefoto = Date.now() + req.body.typefile;
                            var pathimg = path.join(__dirname, '../../public/images/penerimas/') + namefoto;
                            var imgdata = req.body.foto;
                            var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                            fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                                console.log(err);
                            });

                            var sql = `UPDATE penerimas SET nama_penerima = "${req.body.nama}" , nohp_penerima = "${req.body.nohp}", alamat_penerima = "${req.body.alamat}", kebutuhan_biaya = "${req.body.biaya}", rincian_kebutuhan = "${req.body.rincianbiaya}", foto_penerima = "${urlfoto+namefoto}", update_at = "${timestamp}" where id_penerima = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas where id_penerima = "${req.params.id}" and delete_at is null ORDER BY nama_penerima ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        } else {
                            var sql = `UPDATE penerimas SET nama_penerima = "${req.body.nama}" , nohp_penerima = "${req.body.nohp}", alamat_penerima = "${req.body.alamat}", kebutuhan_biaya = "${req.body.biaya}", rincian_kebutuhan = "${req.body.rincianbiaya}", update_at = "${timestamp}" where id_penerima = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas where id_penerima = "${req.params.id}" and delete_at is null ORDER BY nama_penerima ASC`;
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


router.delete('/delete/:id', (req, res, next) => {
    var sql = `UPDATE penerimas SET delete_at = "${timestamp}" where id_penerima = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});

router.put('/publish/:id',(req, res, next) =>{

                            var sql = `UPDATE penerimas SET publish = "${req.body.publish}" where id_penerima = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_penerima, nama_penerima, nohp_penerima, alamat_penerima, kebutuhan_biaya, rincian_kebutuhan, publish, foto_penerima FROM penerimas where id_penerima = "${req.params.id}" and delete_at is null ORDER BY nama_penerima ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

})

module.exports = router