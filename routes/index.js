var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
// Connection URL
const mongoURL = 'mongodb://localhost:27017/breadsdb';

/* GET home page. */

router.get('/', (req,res)=>{
  res.render('index')
})
router.get('/data', async (req, res, next) =>{
  try {
    const client = await MongoClient.connect(mongoURL, {
      useNewUrlParser : true,
      useUnifiedTopology : true
    });
    console.log('Connected to MongoDB');
    const db = client.db();

    const collection = db.collection('data');
    const data = await collection.find().toArray();

    res.json(data)
    // res.render('index', {data:results})
  } catch (error) {
    console.error('Error Connecting to MongoDB:',error)
    res.status(500).send('Internal Server Error')
  }
});
// db.data.insertMany([{id:1, string:'Testing data', integer:13, float:1.21,date: new Date("2023-01-30"), boolean:true},{id:2, string:'Testing', integer:12, float:2.21,date: new Date("2017-10-12"),boolean:true},{id:3, string:'data', integer:20, float:4.1,date: new Date("2022-12-30"),boolean:false},{id:4, string:'ini', integer:14, float:1.5,date: new Date("2023-01-08"), boolean:true}])

module.exports = router;
