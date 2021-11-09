const express = require('express')
const app = express()
const port = 8790
let titolo = null;
let contatore = 0;

// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
// parse application/json, basically parse incoming Request Object as a JSON Object 
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!  +  questo è il primo get')

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
/*  questo --> non funziona
app.patch('/', (req, res) => {
  titolo=titolo+ contatore +" modifica"
  contatore=contatore+1
});
*/
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})