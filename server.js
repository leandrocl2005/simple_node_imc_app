/* ============== Start Second Part Here =============== */
/* install node if not */
/* create empty file server.js */
/* run> npm init -y */
/* with npm start you run server.js */
/* package.json ---->
{
  "name": "imc",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}*/
/* run> npm install express */
/* run> npm install -D nodemon */
/* change "start": "node server.js" to "start": "nodemon server.js" */

/* ============== Start Second Part Here =============== */
/* create views folder */
/* put index.html inside views folder */
/* put projetos.html inside views folder */
/* run> npm install nunjucks */
/* create public folder */

const express = require('express')
const nunjucks = require('nunjucks')
const axios = require('axios')

const db = require("./db.js")

const server = express()

server.use(express.static("public"))
server.use(express.urlencoded({extended: true}))
server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false, /* to render html as data, see about.work */
    nocache: true 
})


server.get("/", function(req, res) {

    db.all(`
        SELECT
        COUNT(*) AS total
        FROM
            imc
        GROUP BY
            sexo
        ORDER BY sexo ASC
    `, function(err, rows) {

        const total_men = rows[1]["total"]
        const total_women = rows[0]["total"]

        res.render("index.njk", {
            total_men,
            total_women
        })
    })
})

server.post("/", function(req, res) {

    console.log(req.body)


    // get form data
    let {weight, height, sexo} = req.body

    // valid data
    if (weight == "") {
        return res.send("Preencher peso!")
    }
    
    // format form data
    weight = Number(weight.replace(',','.'))
    //height = Number(height.replace(',','.'))
    sexo = Number(sexo)

    // save data
    const values = [
        height,
        weight,
        sexo
    ]
    const query = `
        INSERT INTO imc (
            altura,
            peso,
            sexo
        ) VALUES (?,?,?);
    `
    function afterInsert(err) { // don't use arrow funcs
    if (err) {
        return res.send("Erro no cadastro!")
    }
        return res.redirect("/")
    }   
    db.run(query, values, afterInsert)    
})

server.get("/table/:page", function(req, res) {
    const {page} = req.params
    db.all(`
        select * from imc limit 4 offset ${page}
    `, function(err, rows) {
        res.render("table.njk", {rows})
    })
})

server.get("/github", async function(req, res) {
    
    const user = await axios.get('https://api.github.com/users/' + "leandrocl2005")
    .then(function(response){
      return response.data
    });
    
    db.all(`
        select * from imc limit 6
    `, function(err, rows) {
        return res.render("github.njk", {user, rows})
    })
    
})

server.get("/api/hg", function(req, res) {
    return res.send({
        lim_inf: [10, 20, 25, 30, 35, 40, 45],
        lim_sup: [20, 30, 35, 40, 41, 45, 55],
        cum_count: [5, 10, 15, 20, 30, 40, 50]
    })
})

server.get("/hg", function(req, res) {
    db.all(`
        select * from imc limit 6
    `, function(err, rows) {
        return res.render("highchart.njk", {rows})
    })
    
})

server.listen(5000, function(){
    console.log("server is run!")
})
