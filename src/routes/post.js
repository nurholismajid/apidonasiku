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
    var sql = "SELECT posts.id_post, posts.id_category, posts.create_at, categorysposts.name_category, penerimas.id_penerima, penerimas.nama_penerima, posts.slug, posts.thumbnail, posts.title, posts.headline, posts.content, posts.publish, posts.id_user, users.nama_user FROM posts INNER JOIN categorysposts ON categorysposts.id_category = posts.id_category INNER JOIN users ON users.id_user = posts.id_user  LEFT JOIN penerimas ON penerimas.id_penerima = posts.id_penerima   where posts.delete_at is null ORDER BY posts.title ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.get('/:id', (req, res, next) => {
    var sql = `SELECT posts.id_post, posts.id_category, posts.create_at, categorysposts.name_category, penerimas.id_penerima, penerimas.nama_penerima, posts.slug, posts.thumbnail, posts.title, posts.headline, posts.content, posts.publish, posts.id_user, users.nama_user FROM posts INNER JOIN categorysposts ON categorysposts.id_category = posts.id_category INNER JOIN users ON users.id_user = posts.id_user  LEFT JOIN penerimas ON penerimas.id_penerima = posts.id_penerima where posts.id_post = "${req.params.id}" AND posts.delete_at is null ORDER BY posts.title ASC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.idcategory != "" && req.body.slug != "" && req.body.title != "" && req.body.headline != "" && req.body.content != "" && req.body.iduser != "" && req.body.foto != "" && req.body.typefile != "") {
                    var urlfoto = "http://192.168.42.232:8080/images/posts/";
                    var namefoto = Date.now() + req.body.typefile;
                    var pathimg = path.join(__dirname, '../../public/images/posts/') + namefoto;

                    var imgdata = req.body.foto;

                    var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                    fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                        console.log(err);
                    });

                    var sql = `INSERT INTO posts (id_post, id_category, id_penerima, slug, thumbnail, title, headline, content, publish, id_user, create_at) values ('${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}','${req.body.idcategory}','${req.body.idpenerima}','${req.body.slug}','${urlfoto+namefoto}','${req.body.title}','${req.body.headline}','${req.body.content}','draf','${req.body.iduser}','${timestamp}')`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: {  } });
                    })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.put('/update/:id', (req, res, next) => {
    if (req.body.idcategory != "" && req.body.slug != "" && req.body.title != "" && req.body.headline != "" && req.body.content != "" && req.body.iduser != "") {       
                        if (req.body.foto != "" && req.body.fotolama != "") {

                            var fotolama = req.body.fotolama.slice(40);
                            var pathfotolama = path.join(__dirname, '../../public/images/posts/') + fotolama;

                            fs.unlink(pathfotolama, function(err) {
                                console.log(err);
                            });

                            var urlfoto = "http://192.168.42.232:8080/images/posts/";
                            var namefoto = Date.now() + req.body.typefile;
                            var pathimg = path.join(__dirname, '../../public/images/posts/') + namefoto;
                            var imgdata = req.body.foto;
                            var base64Data = imgdata.replace(/^data:image\/png;base64,/, "");

                            fs.writeFile(pathimg, base64Data, 'base64', function(err) {
                                console.log(err);
                            });

                            var sql = `UPDATE posts SET id_category = '${req.body.idcategory}' , id_penerima = '${req.body.idpenerima}', slug = '${req.body.slug}', title = '${req.body.title}', headline = '${req.body.headline}', thumbnail = '${urlfoto+namefoto}', content = '${req.body.content}', id_user = '${req.body.iduser}', update_at = '${timestamp}' where id_post = '${req.params.id}'`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_post, id_category, id_penerima, slug, thumbnail, title, headline, content, publish, id_user  FROM posts where id_post = "${req.params.id}" and delete_at is null ORDER BY title ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

                        } else {
                            var sql = `UPDATE posts SET id_category = '${req.body.idcategory}' , id_penerima = '${req.body.idpenerima}', slug = '${req.body.slug}', title = '${req.body.title}', headline = '${req.body.headline}', content = '${req.body.content}', id_user = '${req.body.iduser}', update_at = '${timestamp}' where id_post = '${req.params.id}'`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_post, id_category, id_penerima, slug, thumbnail, title, headline, content, publish, id_user  FROM posts where id_post = "${req.params.id}" and delete_at is null ORDER BY title ASC`;
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
    var sql = `UPDATE posts SET delete_at = "${timestamp}" where id_post = "${req.params.id}"`;
    db.query(sql, function(err, result) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal menghapus data" });
        }
        res.json({ status: "success", message: "Data terhapus" });
    })
});

router.put('/publish/:id',(req, res, next) =>{

                            var sql = `UPDATE posts SET publish = "${req.body.publish}" where id_post = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                res.json({ status: "success", message: "Data di perbarui", data: {} });
                            })

})

module.exports = router