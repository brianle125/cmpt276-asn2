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
  let id = req.body.rId;
  let name = req.body.rName;
  let width = req.body.rWidth;
  let height = req.body.rHeight;
  let color = req.body.rColor;

  try {
    const client = await pool.connect();
    const result = await client.query(`INSERT INTO rects VALUES(3, 'Bob', 4, 5, 'red)`);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/redirect', (req, res) => {
  res.render('pages/index');
}) 

app.get('/test/:id', (req,res)=>{ //something something rectangles ids
    console.log(req.params.id);

})
app.get('/add', (req,res)=> {
    res.render('pages/newrectangle')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
