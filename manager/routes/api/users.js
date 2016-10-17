const express = require('express');
const bodyParser = require('body-parser');
const async = require('async');

const router = express.Router();
const jsonParser = bodyParser.json();

const getSqlConnection = require('../../getSqlConnection');

// Database info
const table_id = "Users";
const table_drinks = "Drinks";
const table_journal = "Journal";

// Get all users info
router.get('/', (req, res) => {
  const sql = `SELECT name, email, id FROM ${table_id};`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release();
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      res.json(rows);
    });
  });
});

// Get user info by id
router.get('/:id', (req, res) => {
  var name = '';
  const id = req.params.id;
  const sql = `SELECT name FROM ${table_id} WHERE id = '${id}';`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err, rows) => {
      connection.release();
      if (err) {
        console.log("SQL error:", err);
        res.sendStatus(500);
        return;
      }
      if (rows.length == 0) {
        res.sendStatus(404);
        return;
      }
      delete rows[0].password;
      res.json(rows[0]);
    });
  });
});

// create a new user
router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  if(!(req.body.id && req.body.name && req.body.email && req.body.password)) {
    res.sendStatus(400);
    return;
  }
  const password = req.body.password;
  const sql = `INSERT INTO ${table_id} (id, name, email, password) VALUES ('${req.body.id}', '${req.body.name}', '${req.body.email}', '${password}');`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err) => {
      connection.release();
      if (err) {
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409);
          res.send(err.code);
          return;
        }
        res.sendStatus(400);
        return;
      }
      res.sendStatus(201);
    });
  });
});

// delete a user
router.delete('/', jsonParser, (req, res) => {
  if (!req.body.id) {
    res.sendStatus(400);
    return;
  }
  const sql = `DELETE FROM ${table_id} WHERE id = '${req.body.id}'`;
  getSqlConnection((err, connection) => {
    connection.query(sql, (err) => {
      connection.release();
      if (err) {
        console.log(err);
        res.sendStatus(400);
        return;
      }
      res.sendStatus(204);
    });
  });
});

module.exports = router;
