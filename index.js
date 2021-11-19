// risolve in automatico il problema della gestione degli errori asincroni in express
require("express-async-errors");

// serve per effettuare la validazione dei dati senza sforzo
const { body, validationResult } = require("express-validator");
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
[body("item").notEmpty().isString().toUpperCase(), body("userName").notEmpty().isString().isAlpha().toUpperCase()],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item, userName } = req.body; // ES6 destructuring objects or arrays
    const orderModel = await new Order({ item, userName });
    await orderModel.save();
    const order = await Order.find({}); // p

    await bot.sendMessage(chatId, `Panino ${item} ordinato correttamente`);

    res.send(order);
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
  }
);

//------------------------------------------------------------------------------------------------
//stampa tutti  gli ordini che ha fatto un solo cliente

app.get("/api/orders/:userName", async (req, res) => {
  const { userName } = req.params;
  userName.toUpperCase()
  console(userName);
  if (!userName) {
    res.status(400).send("Specifica un utente");
  }
  const order = await Order.find({ userName });
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

app.post("/api/items",[body("item").notEmpty().isString()], async (req, res) => {
  const { item } = req.body; //prendiamo nome dalbody
  if (!item) {
    res.status(400).send("Specificare un rticolo"); //indica un errore
  }
  const itemModel = await new Item({ item });
  await itemModel.save();
  const items = await Item.find({});
  res.send(items);

  // const newStudent = [...items, { id, nome }]; //ES6 destructuring array aggiunge oggetto al items
  // fs.writeFile("items.json", JSON.stringify(newStudent, null, 1), (err) => {
  //   //wriitefile scrive i dati nel file items.JSON
  //   if (err) {
  //     console.log("errore", err);
  //     res.status(500).send("Errore durante la scrittura del file");
  //   }
  //   res.send({ student: newStudent });
  // });
});

//------------------------------------------------------------------------------------------------
//parte la pagina sulla route principale.

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
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
