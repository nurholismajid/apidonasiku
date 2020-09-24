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

router.get('/', (req, res, next) => {
    var sql = "SELECT id_user, nama_user, email_user, level, foto_user FROM users where delete_at is null ORDER BY nama_user ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id_user, nama_user, email_user, level, foto_user FROM users where id_user = "${req.params.id}" AND delete_at is null ORDER BY nama_user ASC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.nama != "" && req.body.email != "" && req.body.password != "" && req.body.level != "" && req.body.foto != "" && req.body.typefile != "") {
        var sql = `SELECT * FROM users where delete_at is null and email_user = "${req.body.email}"`;
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.status(500).send({ status: "failed", message: "masalah koneksi " });
            } else {
                if (rows.length > 0) {
                    res.status(200).send({ status: "failed", message: "email sudah digunakan" });
                } else {
                    var urlfoto = "http://192.168.10.218:8080/images/users/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/users/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO users (id_user, nama_user, email_user, password_user, level, foto_user, create_at) values ("${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}","${req.body.nama}","${req.body.email}","${md5(req.body.password)}","${req.body.level}","${urlfoto+namefoto}","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: { nama: req.body.nama, email: req.body.email, level: req.body.level, foto: urlfoto + namefoto } });
                    })
                }
            }

        })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.put('/update/:id', (req, res, next) => {
    if (req.body.nama != "" && req.body.email != "" && req.body.level != "") {
        var sql = `SELECT * FROM users where delete_at is null and email_user = "${req.body.email}"`;
        db.query(sql, function(err, rows, fields) {
            if (err) {
                res.status(500).send({ status: "failed", message: "masalah koneksi " });
            } else {
                if (rows.length > 0) {
                    if (req.params.id != rows[0].id_user) {
                        res.status(200).send({ status: "failed", message: "email sudah digunakan" });
                    } else {
                        if (req.body.foto != "" && req.body.fotolama != "") {

                            var fotolama = req.body.fotolama.slice(40);
                            var pathfotolama = path.join(__dirname, '../../public/images/users/') + fotolama;

                            fs.unlink(pathfotolama, function(err) {
                                console.log(err);
                            });

                            var urlfoto = "http://192.168.10.218:8080/images/users/";
                            var namefoto = Date.now() + req.body.typefile;
                            var pathimg = path.join(__dirname, '../../public/images/users/') + namefoto;
                            var imgdata = req.body.foto;
                            var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                            fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                                console.log(err);
                            });

                            var sql = `UPDATE users SET nama_user = "${req.body.nama}" , email_user = "${req.body.email}" , level = "${req.body.level}", foto_user = "${urlfoto+namefoto}", update_at = "${timestamp}" where id_user = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_user, nama_user, email_user, level, foto_user FROM users where id_user = "${req.params.id}" and delete_at is null ORDER BY nama_user ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        } else {
                            var sql = `UPDATE users SET nama_user = "${req.body.nama}" , email_user = "${req.body.email}" , level = "${req.body.level}", update_at = "${timestamp}" where id_user = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_user, nama_user, email_user, level, foto_user FROM users where id_user = "${req.params.id}" and delete_at is null ORDER BY nama_user ASC`;
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

                        var fotolama = req.body.fotolama.slice(40);
                        var pathfotolama = path.join(__dirname, '../../public/images/users/') + fotolama;

                        fs.unlink(pathfotolama, function(err) {
                            console.log(err);
                        });

                        var urlfoto = "http://192.168.10.218:8080/images/users/";
                        var namefoto = Date.now() + req.body.typefile;
                        var pathimg = path.join(__dirname, '../../public/images/users/') + namefoto;
                        var imgdata = req.body.foto;
                        var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                        fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                            console.log(err);
                        });

                        var sql = `UPDATE users SET nama_user = "${req.body.nama}" , email_user = "${req.body.email}" , level = "${req.body.level}", foto_user = "${urlfoto+namefoto}", update_at = "${timestamp}" where id_user = "${req.params.id}"`;
                        db.query(sql, function(err, result) {
                            if (err) {
                                res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                            }
                            var sql = `SELECT id_user, nama_user, email_user, level, foto_user FROM users where id_user = "${req.params.id}" and delete_at is null ORDER BY nama_user ASC`;
                            db.query(sql, function(err, rows, fields) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                }
                                res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                            })
                        })

                    } else {
                        var sql = `UPDATE users SET nama_user = "${req.body.nama}" , email_user = "${req.body.email}" , level = "${req.body.level}", update_at = "${timestamp}" where id_user = "${req.params.id}"`;
                        db.query(sql, function(err, result) {
                            if (err) {
                                res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                            }
                            var sql = `SELECT id_user, nama_user, email_user, level, foto_user FROM users where id_user = "${req.params.id}" and delete_at is null ORDER BY nama_user ASC`;
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
    var sql = `UPDATE users SET delete_at = "${timestamp}" where id_user = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});

module.exports = router