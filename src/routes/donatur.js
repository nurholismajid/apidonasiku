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
    var sql = "SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where delete_at is null ORDER BY nama_donatur ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where id_donatur = "${req.params.id}" AND delete_at is null ORDER BY nama_donatur ASC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.nama != "" && req.body.email != "" && req.body.password != "" && req.body.nohp != "" && req.body.alamat != "" && req.body.foto != "" && req.body.typefile != "") {
        var sql = `SELECT * FROM donaturs where delete_at is null and email_donatur = "${req.body.email}"`;
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.status(500).send({ status: "failed", message: "masalah koneksi " });
            } else {
                if (rows.length > 0) {
                    res.status(200).send({ status: "failed", message: "email sudah digunakan" });
                } else {
                    var urlfoto = "http://192.168.42.232:8080/images/donaturs/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/donaturs/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO donaturs (id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, password_donatur, foto_donatur, create_at) values ("${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}","${req.body.nama}","${req.body.email}","${req.body.nohp}","${req.body.alamat}","${md5(req.body.password)}","${urlfoto+namefoto}","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: { nama: req.body.nama, email: req.body.email, nohp: req.body.nohp, alamat: req.body.alamat, foto: urlfoto + namefoto } });
                    })
                }
            }

        })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.put('/update/:id', (req, res, next) => {
    if (req.body.nama != "" && req.body.email != "" && req.body.nohp != "" && req.body.alamat != "") {
        var sql = `SELECT * FROM donaturs where delete_at is null and email_donatur = "${req.body.email}"`;
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.status(500).send({ status: "failed", message: "masalah koneksi " });
            } else {
                if (rows.length > 0) {
                    if (req.params.id != rows[0].id_donatur) {
                        res.status(200).send({ status: "failed", message: "email sudah digunakan" });
                    } else {
                        if (req.body.foto != "" && req.body.fotolama != "") {

                            var fotolama = req.body.fotolama.slice(43);
                            var pathfotolama = path.join(__dirname, '../../public/images/donaturs/') + fotolama;

                            fs.unlink(pathfotolama, function(err) {
                                console.log(err);
                            });

                            var urlfoto = "http://192.168.42.232:8080/images/donaturs/";
                            var namefoto = Date.now() + req.body.typefile;
                            var pathimg = path.join(__dirname, '../../public/images/donaturs/') + namefoto;
                            var imgdata = req.body.foto;
                            var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                            fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                                console.log(err);
                            });

                            var sql = `UPDATE donaturs SET nama_donatur = "${req.body.nama}" , email_donatur = "${req.body.email}" , nohp_donatur = "${req.body.nohp}", alamat_donatur = "${req.body.alamat}", foto_donatur = "${urlfoto+namefoto}", update_at = "${timestamp}" where id_donatur = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where id_donatur = "${req.params.id}" and delete_at is null ORDER BY nama_donatur ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        } else {
                            var sql = `UPDATE donaturs SET nama_donatur = "${req.body.nama}" , email_donatur = "${req.body.email}" , nohp_donatur = "${req.body.nohp}", alamat_donatur = "${req.body.alamat}", update_at = "${timestamp}" where id_donatur = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where id_donatur = "${req.params.id}" and delete_at is null ORDER BY nama_donatur ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        }
                    }
                } else {
                    if (req.body.foto != "" && req.body.fotolama != "") {

                        var fotolama = req.body.fotolama.slice(43);
                        var pathfotolama = path.join(__dirname, '../../public/images/donaturs/') + fotolama;

                        fs.unlink(pathfotolama, function(err) {
                            console.log(err);
                        });

                        var urlfoto = "http://192.168.42.232:8080/images/donaturs/";
                        var namefoto = Date.now() + req.body.typefile;
                        var pathimg = path.join(__dirname, '../../public/images/donaturs/') + namefoto;
                        var imgdata = req.body.foto;
                        var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                        fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                            console.log(err);
                        });

                        var sql = `UPDATE donaturs SET nama_donatur = "${req.body.nama}" , email_donatur = "${req.body.email}" , nohp_donatur = "${req.body.nohp}", alamat_donatur = "${req.body.alamat}", foto_donatur = "${urlfoto+namefoto}", update_at = "${timestamp}" where id_donatur = "${req.params.id}"`;
                        db.query(sql, function(err, result) {
                            if (err) {
                                res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                            }
                            var sql = `SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where id_donatur = "${req.params.id}" and delete_at is null ORDER BY nama_donatur ASC`;
                            db.query(sql, function(err, rows, fields) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                }
                                res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                            })
                        })

                    } else {
                        var sql = `UPDATE donaturs SET nama_donatur = "${req.body.nama}" , email_donatur = "${req.body.email}" , nohp_donatur = "${req.body.nohp}", alamat_donatur = "${req.body.alamat}", update_at = "${timestamp}" where id_donatur = "${req.params.id}"`;
                        db.query(sql, function(err, result) {
                            if (err) {
                                res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                            }
                            var sql = `SELECT id_donatur, nama_donatur, email_donatur, nohp_donatur, alamat_donatur, foto_donatur FROM donaturs where id_donatur = "${req.params.id}" and delete_at is null ORDER BY nama_donatur ASC`;
                            db.query(sql, function(err, rows, fields) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                }
                                res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                            })
                        })

                    }

                }
            }

        })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.delete('/delete/:id', (req, res, next) => {
    var sql = `UPDATE donaturs SET delete_at = "${timestamp}" where id_donatur = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});

module.exports = router