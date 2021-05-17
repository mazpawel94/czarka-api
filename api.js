const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello Word");
});

let globalSocket;
function setSocketIo(io) {
  io.on("connect", socket => {
    globalSocket = io;
    // socket.broadcast.emit("message", "new connected");
  })
}
async function loadDB(collectionName) {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://czarka:ZXqnEiX7RdV3wt7l@cluster0.y8t8a.mongodb.net/reservations?retryWrites=true&w=majority",
    {
      useNewUrlParser: true
    }
  );
  return client.db("reservations").collection(`${collectionName}`);
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
  if (req.query.password !== "KtoNieSkaczeTenZTaheeboHopHopHop") {
    res.status(404).send("bad password");
    return;
  }
  const collection = await loadDB("reservations");
  const reservations = await collection.find({}).toArray();
  res.status(200).send(reservations);
});

router.put("/reservations-for-czarkonauci", async (req, res) => {
  if (req.query.password !== "KtoNieSkaczeTenZTaheeboHopHopHop") {
    res.status(404).send("bad password");
    return;
  }
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
        guests: req.body.guests
      }
    }
  );
  globalSocket.emit('change', 'change reservation');
  res.status(201).send(reservations);
});

router.delete("/reservations-for-czarkonauci", async (req, res) => {
  if (req.query.password !== "KtoNieSkaczeTenZTaheeboHopHopHop") {
    res.status(404).send("bad password");
    return;
  }
  const collection = await loadDB("reservations");
  const reservations = await collection.deleteOne({
    _id: new mongodb.ObjectID(req.body.id)
  });
  globalSocket.emit('change', 'delete reservation');
  res.status(200).send(reservations);
});

router.post("/reservations-for-czarkonauci", async (req, res) => {
  if (req.query.password !== "KtoNieSkaczeTenZTaheeboHopHopHop") {
    res.status(404).send("bad password");
    return;
  }
  const collection = await loadDB("reservations");
  await collection.insertOne({
    date: req.body.day,
    hour: req.body.hour,
    name: req.body.name,
    table: req.body.table,
    guests: req.body.guests
  });
  globalSocket.emit('change', 'new reservation');
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
  if (req.query.password !== "KtoNieSkaczeTenZTaheeboHopHopHop") {
    res.status(404).send("bad password");
    return;
  }
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

// do wersji demo - bez hasła
router.get("/demo-version", async (req, res) => {
  const collection = await loadDB("reservations-sheet-demo");
  const reservations = await collection.find({}).toArray();
  res.status(200).send(reservations);
});

router.put("/demo-version", async (req, res) => {
  const collection = await loadDB("reservations-sheet-demo");
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
        guests: req.body.guests
      }
    }
  );
  res.status(201).send(reservations);
});

router.delete("/demo-version", async (req, res) => {
  const collection = await loadDB("reservations-sheet-demo");
  const reservations = await collection.deleteOne({
    _id: new mongodb.ObjectID(req.body.id)
  });
  res.status(200).send(reservations);
});

router.post("/demo-version", async (req, res) => {
  const collection = await loadDB("reservations-sheet-demo");
  await collection.insertOne({
    date: req.body.day,
    hour: req.body.hour,
    name: req.body.name,
    table: req.body.table,
    guests: req.body.guests
  });
  res.status(201).send(req.body.name);
});

module.exports = { router, setSocketIo };
