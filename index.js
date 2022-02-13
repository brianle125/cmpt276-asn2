const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:killllik@localhost/asn2'
})

var app = express()
  
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.get('/rectangles', (req,res)=>{
    // let data = { results: [1,2,3,4,5]};
    var getUsersQuery = 'SELECT * FROM rectangles';
    pool.query(getUsersQuery, (error,result) => {
        if(error) {
            console.log('it did not work');
            res.send(error);
        }
        data = {results : result.rows}; //array of rows
        res.render('pages/db', data);
    })
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
app.get('/test/:id', (req,res)=>{ //something something rectangles ids
    console.log(req.params.id);

})
app.get('/rectangles/new', (req,res)=> {
    res.render('pages/newrectangle')
    
    let id = req.body.rId;
    let name = req.body.rName;
    let width = req.body.rWidth;
    let height = req.body.rHeight;
    let color = req.body.rColor;

    function func() {
        var userAddRectangleQuery = `INSERT INTO rectangles VALUES (${id},'${name}',${width},${height},'${color}')`;
        pool.query(userAddRectangleQuery, (error,result) => {
            if(error)
            res.send(error);
        })
    }

})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
