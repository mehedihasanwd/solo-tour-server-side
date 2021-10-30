const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB - URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbhxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

// MongoDB - Client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("soloTour");
    const tourCollection = database.collection("tours");
    const orderCollection = database.collection("orders");

    // GET Tours API
    app.get("/tours", async (req, res) => {
      const cursor = tourCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    // GET Specific Tour API
    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await tourCollection.findOne(query);
      res.json(tour);
    });

    // Orders API - POST
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    // Orders API - GET
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      const userOrder = orders.filter((mail) => mail.email === email);
      res.send(userOrder);
    });

    // Delete Specific Tour API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await tourCollection.deleteOne(query);
      res.json(order);
    });

    // All Orders API - GET
    app.get("/allorders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // POST Tours API
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      console.log("Hit the post api", tour);
      const result = await tourCollection.insertOne(tour);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Default Route
app.get("/", (req, res) => {
  res.send("'Solo Tour' server side running");
});

// Listening to the port
app.listen(port, () => {
  console.log("Listening to port: ", port);
});
