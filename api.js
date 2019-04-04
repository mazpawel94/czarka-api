const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello Word");
});
async function loadDB(collectionName) {
  const client = await mongodb.MongoClient.connect(
    "mongodb://heroku_blbg8v1d:mqt4qpfkpned9r9mnk189v8f84@ds063439.mlab.com:63439/heroku_blbg8v1d",
    {
      useNewUrlParser: true
    }
  );
  return client.db("heroku_blbg8v1d").collection(`${collectionName}`);
}

router.get("/reservations", async (req, res) => {
  const collection = await loadDB("reservations");
  const reservations = await collection
    .find({})
    .project({ name: 0 })
    .toArray();
  res.status(200).send(reservations);
});

router.get("/reservations-for-czarkonauci", async (req, res) => {
  const collection = await loadDB("reservations");
  const reservations = await collection.find({}).toArray();
  res.status(200).send(reservations);
});

router.put("/reservations-for-czarkonauci", async (req, res) => {
  const collection = await loadDB("reservations");
  const reservations = await collection.update(
    {
      _id: new mongodb.ObjectID(req.body.id)
    },
    {
      $set: {
        date: req.body.day,
        hour: req.body.hour,
        name: req.body.name,
        table: req.body.table,
        note: req.body.note
      }
    }
  );
  res.status(201).send(reservations);
});

router.delete("/reservations-for-czarkonauci", async (req, res) => {
  const collection = await loadDB("reservations");
  const reservations = await collection.deleteOne({
    _id: new mongodb.ObjectID(req.body.id)
  });
  res.status(200).send(reservations);
});

router.post("/reservations", async (req, res) => {
  const collection = await loadDB("reservations");
  await collection.insertOne({
    date: req.body.day,
    hour: req.body.hour,
    name: req.body.name,
    table: req.body.table,
    note: req.body.note
  });
  res.status(201).send(req.body.name);
});

router.get("/tables-live", async (req, res) => {
  const collection = await loadDB("tablelives");
  const busy = await collection.find({}).toArray();
  res.status(200).send(busy);
});

router.post("/tea-available", async (req, res) => {
  const collection = await loadDB("teas");
  await collection.insertOne({
    tea: req.body.tea,
    available: req.body.available
  });
  res.status(201).send(req.body.name);
});

router.get("/tea-available", async (req, res) => {
  const collection = await loadDB("teas");
  const notAvailable = await collection.find({ available: "false" }).toArray();
  res.status(200).send(notAvailable);
});

router.put("/tea-available", async (req, res) => {
  const collection = await loadDB("teas");
  const tea = await collection.update(
    {
      tea: req.body.tea
    },
    {
      $set: {
        available: req.body.available
      }
    }
  );
  res.status(201).send(tea);
});

module.exports = router;
