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

    const doc = {
      name: "Solo Tour",
      email: "solotour@gmail.com",
    };

    const result = await tourCollection.insertOne(doc);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Default Route
app.get("/", (req, res) => {
  res.send("'Solo Tour' server side running");
});

// Services Route
app.get("/services", (req, res) => {
  res.send("This is Services");
});

// Listening to the port
app.listen(port, () => {
  console.log("Listening to port: ", port);
});
