const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();


const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors());
app.use(bodyParser.json());

app.post("/addMenu", (req, res) => {
  const menu = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("items");
    collection.insert(menu, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("orders");
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

app.get("/items/:category", (req, res) => {
  const category = req.params.category;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion").collection("items");
    collection.find({ type: category }).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Red Onion Server</h1>");
});

app.listen(4200, () => {
  console.log("Listening at port 4200");
});
