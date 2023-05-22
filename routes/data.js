var express = require('express')
var router = express.Router();
const moment = require('moment')
const ObjectID = require('mongodb').ObjectId


router.get('/', async (req, res) => {
    try {
        let params = {}
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const page = parseInt(req.query.page) || 1
        const limit = 3
        const skip = (page - 1) * limit;
        const total = await collection.countDocuments()
        const totalPage = Math.ceil(total /limit)
        const data = await collection
        .find()
        .sort({id:1})
        // .limit(limit)
        // .skip(skip)
        .toArray();
        const processData = [];
        data.forEach(item => {
            const formattedDate = moment(new Date(item.date)).format('YYYY-MMMM-DD');
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
        const {id,string,integer,float,date,boolean} = req.body
        if(!id){
            res.status(400).json({error: "Value are required"})
            // alert('Input data')
        }
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