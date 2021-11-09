const express = require('express')
const app = express()
const port = 3000
let titolo = null;
let contatore = 0;
const user =[{name:"sir",surname:"siso"}]  
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
// parse application/json, basically parse incoming Request Object as a JSON Object 
app.use(bodyParser.json());

app.get('/api/orders', (req, res) => {
  res.send([{
    id:1,
    nome: "mario",
    cognome:"rossi",
    ordine:"piadina"
  }])

})
app.get('/api/orders-by-user', (req, res) => {
 res.send(req.body.id)
})
app.post("/", function(req,res){
 
});
app.post("/", (req, res,next,id) => {

  res.send(req.body.nome)
  res.send(req.body.cognome)
  res.send(req.body.ordine)
})
/*
app.get('/2', (req, res) => {
    res.send('Hello World!  +  questo è il secondo  get')

})

app.post('/', (req, res) => {
    if(titolo==null){
      res.send(titolo+" non esiste")
    }
    res.send(titolo+" va e funziona")

})

app.put('/', (req, res) => {
  titolo="bertoli"
  res.send(titolo)
});
/ questo --> non funziona
app.patch('/', (req, res) => {
  titolo=titolo+ contatore +" modifica"
  contatore=contatore+1
});
*/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})