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
/*
app.get('/database', async (req,res)=>{
    try {
        const result = await pool.query('SELECT * FROM users');
        const data = {results: result.rows};
        res.render('pages/db', data);
    }
    catch (error) {
        res.end(error);
    }
})
    */
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
    const result = await client.query(`INSERT INTO rects VALUES(${id}, '${name}', ${width}, ${height}, '${color}')`);
    res.redirect('/database');
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/redirect', (req, res) => {
  res.render('pages/index');
}) 
app.get('/rectangles/:name', (req,res)=>{ //something something rectangles ids
    res.render('pages/rectangle', {name: req.params.name});
})
app.get('/rectangles/:id', async (req,res)=>{ //something something rectangles ids
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM rects WHERE id = ${req.params.id}`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/rectangles', results );
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
