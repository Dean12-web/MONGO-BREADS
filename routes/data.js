var express = require('express')
var router = express.Router();
const moment = require('moment')
const ObjectID = require('mongodb').ObjectId


router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const data = await collection.find().toArray();
        const processData = [];
        data.forEach(item => {
            const formattedDate = moment(item.date).format('YYYY-MMMM-DD');
            processData.push({ ...item, date: formattedDate })
        });
        res.json(processData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error get the data" })
    }
});

router.put('/:id',async (req,res)=>{
    try {
        const{id}=req.params
        const{string,integer,float,date,boolean} =req.body
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const result = await collection.updateMany({_id: new ObjectID(id)},{
            $set : {string:string, integer:parseInt(integer), float:parseFloat(float), date:date, boolean:boolean}
        });
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Error Updating data"})
    }
})

router.post('/', async (req, res) => {
    try {
        const { id, string, integer, float, date, boolean } = req.body
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const result = await collection.insertOne({ id: parseInt(id), string: string,integer: parseInt(integer), float: parseFloat(float), date: date, boolean: boolean })
        res.json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Creating data" })
    }
});


router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const result = await collection.deleteOne({ _id: new ObjectID(id) });
        console.log(result)
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error Deleting the data" });
    }
});
module.exports = router;