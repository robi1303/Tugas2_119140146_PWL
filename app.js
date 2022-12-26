const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/Database.js');
const app = express();
const PORT = process.env.PORT || 5000;

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// created data
app.post('/api/test', (req,res) => {
    //nampung data
    const data = {...req.body};
    const querysql = 'INSERT INTO test SET ?';

    //running query
    koneksi.query(querysql, data, (err, rows, field) => {
        if (err) {
            return res
              .status(500)
              .json({ message: "Gagal masukkan data!", error: err });
    }
    res.status(201).json({ success: true, message: "Berhasil masukkan data!" });
})
});

//log server
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
//GET
app.get("/api/test", (req, res) => {
  const querySql = "SELECT * FROM test";
  koneksi.query(querySql, (err, rows, field) => {
    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }
    res.status(200).json({ success: true, data: rows });
  });
});
//UPDATE
app.put("/api/test/:id", (req, res) => {
  const data = { ...req.body };
  const querySearch = "SELECT * FROM test WHERE id = ?";
  const queryUpdate = "UPDATE test SET ? WHERE id = ?";
  koneksi.query(querySearch, req.params.id, (err, rows, field) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Ada kesalahan pada data", error: err });
    }
    if (rows.length) {
      koneksi.query(queryUpdate, [data, req.params.id], (err, rows, field) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Ada kesalahan pada data", error: err });
        }
        res
          .status(200)
          .json({ success: true, message: "Berhasil update data!" });
      });
    } else {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan!", success: false });
    }
  });
});
//DELETE
// delete data
app.delete("/api/test/:id", (req, res) => {
  const querySearch = "SELECT * FROM test WHERE id = ?";
  const queryDelete = "DELETE FROM test WHERE id = ?";
  koneksi.query(querySearch, req.params.id, (err, rows, field) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Ada kesalahan pada data", error: err });
    }
    if (rows.length) {
      koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Ada kesalahan pada data", error: err });
        }
        res
          .status(200)
          .json({ success: true, message: "Berhasil menghapus data!" });
      });
    } else {
      return res
        .status(404)
        .json({ message: "Data tidak ditemukan!", success: false });
    }
  });
});