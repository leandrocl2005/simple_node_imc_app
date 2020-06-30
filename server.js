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
    return res.render("index.njk")
})

server.post("/", function(req, res) {
    
    // get form data
    let {weight, height} = req.body
    
    // format form data
    weight = Number(weight.replace(',','.'))
    height = Number(height.replace(',','.'))
    
    // valid form data
    if (!weight || !height) {
        return res.redirect("/")
    }

    // compute imc
    let imc = weight / (height * height)
    imc = Math.round(imc * 100) / 100
    imc = imc.toString().replace(".", ",")

    // send results to index
    return res.render("index.njk", {
        ...req.body,
        imc
    })
})

server.listen(5000, function(){
    console.log("server is run!")
})
