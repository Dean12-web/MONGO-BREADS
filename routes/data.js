var express = require('express')
var router = express.Router();
const moment = require('moment')
const ObjectID = require('mongodb').ObjectId


router.get('/', async function (req, res, next) {
    try {
        const params = [];

        if (req.query.checkId && req.query.id) {
            params.push({ id: req.query.id });
        }
        if (req.query.checkStr && req.query.string) {
            params.push({ string: { $regex: req.query.string, $options: 'i' } });
        }
        if (req.query.checkInt && req.query.integer) {
            params.push({ integer: parseInt(req.query.integer) });
        }
        if (req.query.checkFloat && req.query.float) {
            params.push({ float: parseFloat(req.query.float) });
        }
        if (req.query.checkDate && req.query.startDate && req.query.endDate) {
            params.push({
                date: {
                    $gte: new Date(req.query.startDate),
                    $lte: new Date(req.query.endDate)
                }
            });
        }
        if (req.query.checkBol && req.query.boolean) {
            params.push({ boolean: req.query.boolean });
        }
        // http://localhost:3100/data/?page=1&id=&checkStr=on&string=scarlett&integer=&float=&StartDate=&EndDate=&boolean=Choose+the+boolean...
        const db = req.app.locals.db;
        const collection = db.collection('data');
        let query = collection.find(params.length > 0 ? { $and: params } : {});

        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const offset = (page - 1) * limit;
        query = query.skip(offset).limit(limit);

        const total = await collection.countDocuments(params.length > 0 ? { $and: params } : {});
        const pages = Math.ceil(total / limit);

        const queryParams = new URLSearchParams(req.query);
        queryParams.delete('page');
        const url = `${req.path}?${queryParams.toString()}`;

        const data = await query.toArray();

        const processData = [];
        data.forEach(item => {
            const formattedDate = moment(new Date(item.date)).format('YYYY-MMMM-DD');
            processData.push({ ...item, date: formattedDate });
        });

        res.json({
            data: processData,
            page: page,
            pages: pages,
            url: url,
            query: req.query,
        });
    } catch (err) {
        console.error(err);
        // Handle error response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { number, string, integer, float, date, boolean } = req.body
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const result = await collection.updateMany({ _id: new ObjectID(id) }, {
            $set: { number: parseInt(number), string: string, integer: parseInt(integer), float: parseFloat(float), date: date, boolean: boolean }
        });
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error Updating data" })
    }
})

router.post('/', async (req, res) => {
    try {
        const { number, string, integer, float, date, boolean } = req.body
        if (!number) {
            res.status(400).json({ error: "Value are required" })
            // alert('Input data')
        }
        const db = req.app.locals.db;
        const collection = db.collection('data');
        const result = await collection.insertOne({ number: parseInt(number), string: string, integer: parseInt(integer), float: parseFloat(float), date: date, boolean: boolean })
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