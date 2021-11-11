//------------------------------------------------------------------------------------------------
//dichiarazione variabili d'ambiente

const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");
const app = express();
const port = 3000;

app.use(bodyParser.json()); //il dato passato è di tipo json altrimenti non puo leggerlo

let rawdata = fs.readFileSync("items.json");
let items = JSON.parse(rawdata); //items è un array che contiene id e nome dei panini

let data = fs.readFileSync("orders.json");
let orders = JSON.parse(data); //items è un array che contiene id e nome dei panini

//------------------------------------------------------------------------------------------------
//resistuisce tutti gli ordini

app.get("/api/orders", (req, res) => {
  res.send({ orders });
});

//------------------------------------------------------------------------------------------------
//aggiungi un ordine nel array orders

app.post("/api/orders", (req, res) => {
  const { userId, item } = req.body; // ES6 destructuring objects or arrays
  if (!userId || !item) {
    res.status(400).send("Specificare utente ed articolo");
  }
  const newStudent = [...orders, { userId, item }];
  fs.writeFile("orders.json", JSON.stringify(newStudent, null, 1), (err) => {
    //writefile scrive i dati nel file orders.JSON
    if (err) {
      console.log("errore", err);
      res.status(500).send("Errore durante la scrittura del file");
    }
    res.send({ orders: newStudent });
  });
});

//------------------------------------------------------------------------------------------------
//stampa tutti  gli ordini che ha fatto un solo cliente

app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(400).send("Specifica un utente");
  }
  const userOrders = orders.filter((order) => {
    //serve a filtrare gli ordini in base al id
    return Number(order.userId) === Number(userId); // "1" => 1
  });
  res.send({ orders: userOrders });
});

//------------------------------------------------------------------------------------------------
//restituisce tutti i items del file

app.get("/api/items", (req, res) => {
  res.send({ items });
});

//------------------------------------------------------------------------------------------------
//è una route per aggiungere un tipo di panino nel file items.json,
//quindi in questo caso sarà una post che salva nel file json

app.post("/api/items", (req, res) => {
  const { id, nome } = req.body; //prendiamo id e nome dal body
  if (!id || !nome) {
    res.status(400).send("Specificare utente ed articolo"); //indica un errore
  }
  const newStudent = [...items, { id, nome }]; //ES6 destructuring array aggiunge oggetto al items
  fs.writeFile("items.json", JSON.stringify(newStudent, null, 1), (err) => {
    //wriitefile scrive i dati nel file items.JSON
    if (err) {
      console.log("errore", err);
      res.status(500).send("Errore durante la scrittura del file");
    }
    res.send({ student: newStudent });
  });
});

//------------------------------------------------------------------------------------------------
//parte la pagina sulla route principale.

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//------------------------------------------------------------------------------------------------

// Compiti per oggi 11/11/21

// Installare sul pc Mongo (mac probabilmente usa brew)
// Installare Robot3T (https://robomongo.org/)
// Provare a collegarsi a mongo usando Mongoose (https://mongoosejs.com/)
//      - npm i mongoose
//      - mongoose.connect('mongodb://localhost:27017/paninoteka');
//      - dentro paninoteka avrete 2 collections:
//          - orders
//          - items

const startMongo = async () => {
    await setTimeout(() => {});
};

startMongo();