const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var app = express()
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/database', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM rects');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
})
app.post('/login', (req,res)=> {
    console.log("post to /login")
    console.log(req.body)
    let un = req.body.uname;
    let pw = req.body.pass;
    //call database?
    userPasswordQuery =  `SELECT * FROM users WHERE name = '${un}'`;
    res.send('got it.')
})
app.post('/addrectangle', async (req, res) =>{
  let id = req.body.id;
  let name = req.body.name;
  let width = req.body.width;
  let height = req.body.height;
  let color = req.body.color;

  try {
    const client = await pool.connect();
    const result = await client.query(`INSERT INTO rects VALUES(DEFAULT, '${name}', ${width}, ${height}, '${color}')`);
    res.redirect('/database');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/redirect', (req, res) => {
  res.render('pages/index');
}) 
app.get('/rectangles/:name', async (req,res)=>{ //something something rectangles ids
  var name = req.params.name;
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM rects WHERE id = '${name}'`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/rectangle', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.post('/rectangles/:name', async (req, res)=>{
  let buttonValue = req.body.button;
  if(buttonValue == "delete")
  {
    try {
      const client = await pool.connect();
      const result = await client.query(`DELETE FROM rects WHERE id = '${req.params.name}'`);
      res.redirect('/database');
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  } else {
    res.redirect(`/edit/${req.params.name}`);
  }
})
app.get('/edit/:name', async (req, res)=>{
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM rects WHERE id = '${req.params.name}'`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/edit', results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.post('/edit/:name', async (req, res)=>{
  let name = req.body.name;
  let width = req.body.width;
  let height = req.body.height;
  let color = req.body.color;

  try {
    const client = await pool.connect();
    const editQuery = `UPDATE rects set name = '${name}', width = ${width}, height = ${height}, color = '${color}'`;
    await client.query(editQuery);
    res.redirect('/database');
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
app.get('/add', (req,res)=> {
    res.render('pages/newrectangle')
})
app.get('/view', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rects');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/rectangles', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
