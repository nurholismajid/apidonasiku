const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
router.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: true
}));
router.use(bodyparser.json({ limit: "50mb" }));

router.get('/:id', (req, res, next) => {
    var sql = `SELECT id, content, page FROM contetpages where page = "${req.params.id}"`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "gagal mengambil data" });
        }
        res.json({ status: "success", message: "Data di perbarui", data: rows });
    })
});

router.put('/update/:page', (req, res, next) => {

    var sql = `UPDATE contetpages SET content = '${req.body.content}' where page= '${req.params.page}'`;
                            db.query(sql, function(err, result) {
                                if (err) {
                                    res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                                }
                                var sql = `SELECT * FROM contetpages where page= "${req.params.page}"`;
                                db.query(sql, function(err, rows, fields) {
                                    if (err) {
                                        res.status(500).send({ status: "failed", message: "gagal mengambil data" });
                                    }
                                    res.json({ status: "success", message: "Data di perbarui", data: rows[0] });
                                })
                            })

    
});


module.exports = router