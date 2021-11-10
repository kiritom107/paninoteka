const express = require('express')
const app = express()
const port = 3000
let titolo = null;
let contatore = 0;
const user = [{ name: "sir", surname: "siso" }]
const bodyParser = require('body-parser');

app.use(bodyParser.json()) //il dato passato è di tipo json altrimineti non puo leggerlo
let utenti = [
  {
    nome: "mario",
    cognome: "rossi",
  }
]

app.get('/', (req, res) => {
   
})

app.get('/api/orders/:id', (req, res) => {
  let pos = req.params.id
  res.send(utenti[pos])
})

app.post("/api/orders", (req, res) => {
  // console.log(req.body)   // serve per debug 
  const utente = { nome, cognome } = req.body;
  utenti[0] = utente
  res.send(utenti[0])
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*
app.get('/:id', function (req, res) {       come ottenere valore dal id
  res.send(req.params.id)
})
*/