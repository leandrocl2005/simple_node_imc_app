/* ============== Start Second Part Here =============== */
/* install node if not */
/* create empty file server.js */
/* run> npm init -y */
/* with npm start you run server.js */
/* package.json ---->
{
  "name": "aula003Conteudo",
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
        SELECT * FROM imc
    `, function(err, rows) {

        if (err) {
            return console.log(err)
        }

        const total_women = rows.filter(
            (person) => person.sexo==0
        ).length

        const total_men = rows.filter(
            (person) => person.sexo==1
        ).length

        res.render("index.njk", {
            total_men,
            total_women
        })
    })


})

server.post("/", function(req, res) {

    const query = `
        INSERT INTO imc (
            altura,
            peso,
            sexo
        ) VALUES (?,?,?);
    `

    // get form data
    let {weight, height, sexo} = req.body
    
    // format form data
    weight = Number(weight.replace(',','.'))
    height = Number(height.replace(',','.'))
    sexo = Number(sexo)

    const values = [
        height,
        weight,
        sexo
    ]

    function afterInsert(err) { // don't use arrow funcs
    if (err) {
        return res.send("Erro no cadastro!")
    }
        return res.redirect("/")
    }   

    db.run(query, values, afterInsert)    
})

server.listen(5000, function(){
    console.log("server is run!")
})
