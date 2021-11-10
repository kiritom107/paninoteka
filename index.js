const express = require('express')
const app = express()
const port = 3000
let titolo = null;
let contatore = 0;
const user =[{name:"sir",surname:"siso"}]  
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const utenti=[
  {
  nome: "mario",
  cognome:"rossi",
  }
  ,
  {
    nome: "hima",
    cognome:"rossi",
  }
  ,
  {
    nome: "om",
    cognome:"rossi",
  }

]

app.get('/api/orders', (req, res) => {
  res.send([{
    id:1,
    nome: "mario",
    cognome:"rossi",
    ordine:"piadina"
  }])
})

app.get('/',(req,res)=>{
  res.send("sono in root")
})

app.get('/api/orders/:id', (req, res) => {
  let pos = req.params.id
  res.send(utenti[pos])
})

app.get('/:id', function (req, res) {
  res.send(req.params.id)
})

app.post("/", (req, res,next,id) => {
  utenti[0]=(req.body)
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