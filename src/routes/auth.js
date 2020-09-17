require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require("../koneksi/db");
const bodyparser = require("body-parser");
const md5 = require('md5');
const cors = require('cors');
const jwt = require('jsonwebtoken');
router.use(bodyparser.urlencoded({
    extended: true
}))
router.use(cors());
router.use(bodyparser.json());
// router.use(bodyparser.urlencoded({extended:true}));

function generateToken(user) {
    //1. Don't use password and other sensitive fields
    //2. Use the information that are useful in other parts
    if (!user) return null;
   
    const u = {
      userId: user.userId,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin
    };
   
    return jwt.sign(u, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    });
  }

router.post('/', (req, res, next) => {
    const sql = `SELECT id_user, nama_user, email_user, level, foto_user, password_user FROM users where delete_at is null and email_user = "${req.body.email}"`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "masalah koneksi " });
        } else {
            if (rows.length > 0) {
                if (rows[0].password_user == md5(req.body.password)) {
                    const token = generateToken(rows[0]);
                    res.json({ status: "success", message: "login berhasil", token:token, data: rows[0] });
                } else {
                    res.status(200).send({ status: "failed", message: "password salah " });
                }
            } else {
                res.status(200).send({ status: "failed", message: "akun tidak tersedia " });
            }
        }

    })
});

router.post('/gantipassword', (req, res, next) => {
    const sql = `SELECT id_user, nama_user, email_user, level, foto_user, password_user FROM users where delete_at is null and id_user = "${req.body.id}"`;
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.status(500).send({ status: "failed", message: "masalah koneksi " });
        } else {
            if (rows.length > 0) {
                if (rows[0].password_user == md5(req.body.old)) {
                    var sql = `UPDATE users SET password_user = "${md5(req.body.new)}" where id_user = "${req.body.id}"`;
                        db.query(sql, function(err, result) {
                            if (err) {
                                res.status(500).send({ status: "failed", message: "gagal memperbarui data" });
                            }
                                res.json({ status: "success", message: "Password berhasil di perbarui", data: rows[0] });
                        })
                } else {
                    res.status(200).send({ status: "failed", message: "password lama salah " });
                }
            } else {
                res.status(200).send({ status: "failed", message: "akun tidak tersedia " });
            }
        }

    })
});


module.exports = router