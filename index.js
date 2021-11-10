const express = require("express");
const bodyParser = require("body-parser");

const fs = require('fs');
const app = express();
const port = 3000;


let titolo = null;
let contatore = 0;



let rawdata = fs.readFileSync('panini.json');
let student = JSON.parse(rawdata);
console.log(rawdata);

// eliminare array users ed accettare in input delle route solo il nome

let orders = [{ userId: 1, date: new Date(), item: "Panino 1" }]; // farò push di ogni nuovo ordine qui dentro





// editorconfig .editorconfig

app.use(bodyParser.json()); //il dato passato è di tipo json altrimineti non puo leggerlo

app.get("/api/orders", (req, res) => {
  res.send({ orders });
});
// assegnare il suo contenuto ad una variabile
// creare una route GET /api/items che restituisce tutti i panini del file
app.get("/api/orders/items", (req, res) => {
let data = fs.readFileSync('panini.json');
let student = JSON.parse(data);
res.send(student);

});
//una route per aggiungere un tipo di panino nel file json, quindi in questo caso sarà una post che salva nel file json
app.post("/api/orders/items", (req, res) => {
  const { Id, nome } = req.body;
  if (!Id || !nome) {
    res.status(400).send("Specificare utente ed articolo");
  }

  var newData = JSON.stringify({ Id, nome });
  console.log(student.concact(newData));
  fs.writeFile('panini.json', newData, err => {
    

      if(err) throw err;
  
      console.log("New data added");
  })
});

app.post("/api/orders", (req, res) => {
  // ES6 destructuring objects or arrays
  const { userId, item } = req.body;

  if (!userId || !item) {
    res.status(400).send("Specificare utente ed articolo");
  }

  const order = { userId, date: new Date(), item };

  // con db scrivo nel DB
  orders.push(order);

  res.send({ student});
});

app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).send("Specifica un utente");
  }

  // filter


  /*
leverei utenti  e sistemare le route 
aggiungere nome

file panini .json  array di panini finti 

come fare ottenere tutti panini legegre un fil json da un 
  */
  const userOrders = orders.filter((order) => {
    return Number(order.userId) === Number(userId); // "1" => 1
  });

  res.send({ orders: userOrders });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
app.get('/:id', function (req, res) {       come ottenere valore dal id
  res.send(req.params.id)
})
*/
