const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();
router.get('/', (req,res) => {
    res.send('Hello Word');
})
async function loadDB(collectionName) {
    const client = await mongodb.MongoClient.connect('mongodb://heroku_blbg8v1d:mqt4qpfkpned9r9mnk189v8f84@ds063439.mlab.com:63439/heroku_blbg8v1d', {
        useNewUrlParser: true
    });
    return client.db('heroku_blbg8v1d').collection(`${collectionName}`);
}

router.get('/reservations', async(req, res) => {
    const collection = await loadDB('reservations');
    const reservations = await collection.find({}).project({name: 0}).toArray();
    res.status(200).send(reservations);
})

router.post('/reservations', async(req, res) => {
    const collection = await loadDB('reservations');
    await collection.insertOne({
        'date': req.body.day,
        'hour': req.body.hour,
        'name': req.body.name,
        'table': req.body.table,
        'amount': req.body.numberPeople
    });
    res.status(201).send(req.body.name);
})

router.get('/tables-live', async(req, res) => {
    const collection = await loadDB('tablelives');
    const busy = await collection.find({}).toArray();
    res.status(200).send(busy);
})

module.exports = router;