var express = require('express');
var router = express.Router();
const moment = require('moment');
const ObjectId = require('mongodb').ObjectId


/* GET home page. */

router.get('/', (req,res)=>{
  res.render('index')
})


// db.data.insertMany([{id:1, string:'Testing data', integer:13, float:1.21,date: new Date("2023-01-30"), boolean:true},{id:2, string:'Testing', integer:12, float:2.21,date: new Date("2017-10-12"),boolean:true},{id:3, string:'data', integer:20, float:4.1,date: new Date("2022-12-30"),boolean:false},{id:4, string:'ini', integer:14, float:1.5,date: new Date("2023-01-08"), boolean:true}])

module.exports = router;