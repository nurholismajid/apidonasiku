const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
const dateFormat = require('dateformat');
const timestamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
router.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: true
}));
router.use(bodyparser.json({ limit: "50mb" }));
// router.use(bodyparser.urlencoded({extended:true}));

router.get('/', (req, res, next) => {
    var sql = "SELECT id_category, name_category, slug FROM categorysposts where delete_at is null ORDER BY name_category ASC";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id_category, name_category, slug FROM categorysposts where id_category = "${req.params.id}" and delete_at is null ORDER BY name_category ASC`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
    })
});

router.post('/create', (req, res, next) => {
    if (req.body.nama != "" && req.body.slug != "" ) {          
                    var sql = `INSERT INTO categorysposts (id_category, name_category, slug,  create_at) values ("${dateFormat(new Date(), "yyyy-mm-dd-h-MM-ss")}","${req.body.nama}","${req.body.slug}","${timestamp}")`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                        }
                        res.json({ status: "success", message: "Data tersimpan", data: { name : req.body.nama, slug: req.body.slug  } });
                    })

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.put('/update/:id', (req, res, next) => {
    if (req.body.nama != "" && req.body.slug != "") { 

                            var sql = `UPDATE categorysposts SET name_category = "${req.body.nama}" , slug = "${req.body.slug}",  update_at = "${timestamp}" where id_category = "${req.params.id}"`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT id_category, name_category, slug FROM categorysposts where id_category = "${req.params.id}" and delete_at is null ORDER BY name_category ASC`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })          

    } else {
        res.status(200).send({ status: "failed", message: "jangan ada data yang kosong" });
    }
});


router.delete('/delete/:id', (req, res, next) => {
    var sql = `UPDATE categorysposts SET delete_at = "${timestamp}" where id_category = "${req.params.id}"`;
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