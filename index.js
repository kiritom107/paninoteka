// risolve in automatico il problema della gestione degli errori asincroni in express
require("express-async-errors");

const { validateRequest } = require("./middlwares/validate-request");

// serve per effettuare la validazione dei dati senza sforzo
const { body } = require("express-validator");
//------------------------------------------------------------------------------------------------
//dichiarazione variabili d'ambiente
const { startMongoDB } = require("./services/db");
const { Item } = require("./models/Item");
const { Order } = require("./models/order");

const TelegramBot = require("node-telegram-bot-api");
const token = String(process.env.TELGRAM_BOT_TOKEN);
const chatId = String(process.env.CHAT_ID);
const bot = new TelegramBot(token);

const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const fs = require("fs");
const { Console } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); //il dato passato è di tipo json altrimenti non puo leggerlo
app.use(cors());

let rawdata = fs.readFileSync("items.json");
let items = JSON.parse(rawdata); //items è un array che contiene id e nome dei panini

let data = fs.readFileSync("orders.json");
let orders = JSON.parse(data); //items è un array che contiene id e nome dei panini

startMongoDB();
app.get("", async (req, res) => {
  res.send("Paninoteka is online!");
});

//------------------------------------------------------------------------------------------------
//resistuisce tutti gli ordini

app.get("/api/orders", async (req, res) => {
  const order = await Order.find({});
  res.send(order);
});

//------------------------------------------------------------------------------------------------
//aggiungi un ordine nel database

app.post(
  "/api/orders",
  [
    body("item").notEmpty(),
    body("userName").notEmpty().isString().isAlpha().toUpperCase().trim(),
  ],
  validateRequest,
  async (req, res) => {
    const { item, userName } = req.body; // ES6 destructuring objects or arrays
    const orderModel = await new Order({ item, userName });
    await orderModel.save();
    const order = await Order.find({}); // p
    await bot.sendMessage(chatId, `Panino ${item} ordinato correttamente`);
    res.send(order);
  }
);
// const newStudent = [...orders, { userId, item }];
// fs.writeFile("orders.json", JSON.stringify(newStudent, null, 1), (err) => {
//   //writefile scrive i dati nel file orders.JSON
//   if (err) {
//     console.log("errore", err);
//     res.status(500).send("Errore durante la scrittura del file");
//   }

//  main()

// res.send({ userId, item });
// });

//------------------------------------------------------------------------------------------------
//stampa tutti  gli ordini che ha fatto un solo cliente

app.get("/api/orders/:userName", validateRequest, async (req, res) => {
  let { userName } = req.params;
  userName = userName.toUpperCase();
  if (userName == "BERTOLI") {
    res.status(400).send({
      error:
        "MI SCUSI, PER LEI NIENTE PANINI (COSI IMPARA A MANDARMI A MONTEMURLO)",
    });
  }
  if (!userName) {
    res.status(400).send({ error: "Specifica un utente" });
  }

  const order = await Order.find({ userName });
  if (order.length == 0) {
    res.status(400).send({
      error: "QUESTO UTENTE NON HA EFFETUATO NESSUN ORDINE",
    });
  }

  res.send(order); ///  -----> da problemi se si aggiunge le { }
});

//------------------------------------------------------------------------------------------------
//restituisce tutti gli items del dataBase

app.get("/api/items", async (req, res) => {
  const items = await Item.find({});
  res.send(items);
});

//------------------------------------------------------------------------------------------------
//è una route per aggiungere un tipo di panino nel dataBase paninoteka/item
//quindi in questo caso sarà una post che salva nel dataBase

app.post(
  "/api/items",
  [
    body("item").notEmpty().isString().trim(),
    body("descrizione").notEmpty().isString(),
  ],
  validateRequest,
  async (req, res) => {
    const { item, descrizione } = req.body; //prendiamo nome dalbody
    if (!item) {
      res.status(400).send({ error: "Specificare un Articolo" }); //indica un errore
    }
    if (!descrizione) {
      res.status(400).send({ error: "Specificare una descrizione del panino" }); //indica un errore
    }
    const tutti = await Item.find({});

    for (const element of tutti) {
      if (item === element.item) {
        return res.status(400).send({ error: "esiste gia il panino" });
      }
    }

    const itemModel = await new Item({ item, descrizione });
    await itemModel.save();
    const items = await Item.find({});
    res.send(items);
  }
);
// const newStudent = [...items, { id, nome }]; //ES6 destructuring array aggiunge oggetto al items
// fs.writeFile("items.json", JSON.stringify(newStudent, null, 1), (err) => {
//   //wriitefile scrive i dati nel file items.JSON
//   if (err) {
//     console.log("errore", err);
//     res.status(500).send("Errore durante la scrittura del file");
//   }
//   res.send({ student: newStudent });
// });
//------------------------------------------------------------------------------------------------
//parte la pagina sulla route principale.

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

//------------------------------------------------------------------------------------------------

// cancella un singolo panino
app.delete("/api/delete/item/:id", async (req, res, next) => {
  const items = await Item.find({ item: req.params.id });
  if (items.length > 0) {
    Item.deleteOne({ item: req.params.id })
      .then(() => {
        res.status(200).json({
          message: "Deleted!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  } else {
    res.status(400).send({ error: "il panino none esiste" }); //indica un errore
  }
});

//------------------------------------------------------------------------------------------------

//cancella tutti panini
app.delete("/api/delete/item", async (req, res, next) => {
  await Item.deleteMany({});
  res.status(200).json({
    message: "Deleted!",
  });
});

//------------------------------------------------------------------------------------------------

//cancella tutti ordini
app.delete("/api/delete/orders", async (req, res, next) => {
  await Order.deleteMany({});
  res.status(200).json({
    message: "Deleted!",
  });
});

//------------------------------------------------------------------------------------------------

app.delete("/api/delete/singolUtente/:id", async (req, res, next) => {
  console.log("Im in")
  let { userName } = req.params;
  userName = userName.toUpperCase();
  await Order.find({
    userName
  }).deleteMany({});
  
  res.status(200).json({
    message: "Deleted "+req.params.id +" ordes",
  });
});

//------------------------------------------------------------------------------------------------

// cancella un singolo order
app.delete("/api/delete/orders/:userName/:item", async (req, res, next) => {
  const order = await Order.find({
    userName: req.params.userName,
    item: req.params.item,
  });
  if (order.length > 0) {
    Order.deleteOne({ userName: req.params.userName, item: req.params.item })
      .then(() => {
        res.status(200).json({
          message: "Deleted!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  }else{
    res
      .status(400)
      .send({ error: "il ordine associato a questo utente non esiste" }); //indica un errore
  }
});

//------------------------------------------------------------------------------------------------


// un utente puo ordinare piu cose contemporaneamente
// 
