const { Pool } = require('pg');
const express = require('express');
const { query } = require('express-validator');
const { table } = require('node:console');
const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SAMPLE_DB',
  password: '23042002',
  port: 5432,
});

app.use(express.urlencoded({ extended: true }));

app.post('/submit-data', 
  async (req, res) => {
  const { f_name, m_name, l_name, c_num, email } = req.body;
  await pool.query('INSERT INTO sample_table (f_name, m_name, l_name, c_num, email) VALUES ($1,$2,$3,$4,$5)', [f_name, m_name, l_name, c_num, email]);
  res.redirect('/all-data');
});

app.get('/all-data', async (req, res) => {
  const entries = await pool.query('SELECT * FROM sample_table');
  const rows = entries.rows;
  let table = ` <table>
  <tr>
  <th> ID </th> 
  <th> First Name </th> 
  <th> Middle Name </th> 
  <th> Last Name </th> 
  <th> Contact Number </th>
  <th> Email </th> 
  </tr>`;

  rows.forEach(row => { 
    table += `
    <tr>
    <td> ${row.pid}</td>
    <td> ${row.f_name}</td>
    <td> ${row.m_name}</td>
    <td> ${row.l_name}</td>
    <td> ${row.c_num}</td>
    <td> ${row.email}</td/>
    <td> 
    <a href = "/update/${row.pid}"><button>Update</button></a>
    <a href = "/delete/${row.pid}"><button>delete</button></a>
    <td/>
    <tr/>`
  });
  table += `</table>`
  res.send(table);
});


app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM sample_table WHERE pid = $1', [id]);
  res.redirect('/all-data');
});

app.get('/update/:id', async (req, res) => {
  const id = req.params.id;
  const entries = await pool.query('SELECT * FROM sample_table WHERE pid = $1', [id]);
  const row = entries.rows[0];
  res.send(`
    <form action="/update/${id}" method="POST">
      <input type="text" name="f_name" value="${row.f_name}"></input>
      <input type="text" name="m_name" value="${row.m_name}"></input>
      <input type="text" name="l_name" value="${row.l_name}"></input>
      <input type="tel" name="c_num" value="${row.c_num}"></input>
      <input type="email" name="email" value="${row.email}"></input>
      <button type="submit">Save</button>
    </form>`
  );
});

app.post('/update/:id', async(req, res) => {
  const {f_name, m_name, l_name, c_num, email} = req.body;
  const id = req.params.id;
  await pool.query("UPDATE sample_table SET f_name =$1, m_name=$2, l_name=$3, c_num=$4, email=$5  WHERE pid = $6", [f_name, m_name, l_name, c_num, email, id]);
  res.redirect('/all-data');
});

app.listen(3000);
