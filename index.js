const express = require('express');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID

const app = express();
require('dotenv').config()


app.use(cors());
app.use(express.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhwqe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const serviceList = client.db("courierX").collection("services");
    const orderList = client.db("courierX").collection("orders");
    const adminList = client.db("courierX").collection("admin");
    const reviewList = client.db("courierX").collection("review");

    app.post('/update/:id', (req, res)=>{
        const id = ObjectID(req.params.id)
        const info = req.body
        orderList.findOneAndUpdate(
            {_id: id},
            {$set :{status:info.status}}
        )
        .then(result => {
            console.log(result);
            res.send(result)
        })
        .catch(err=>{
            console.log(err);
        })
    })

    app.post('/addAdmin', (req, res)=>{
        adminList.insertOne(req.body)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/admin', (req, res)=>{
        console.log(req.body.email);
        adminList.find({adminEmail:req.body.email})
        .toArray((err,result) => {
            console.log(err);
            res.send(result.length > 0)
            console.log(result);
        })
    })


    app.post("/addService", (req, res) => {
        const serviceInfo = req.body 
        serviceList.insertOne(serviceInfo)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addReview' , (req, res)=>{
        reviewList.insertOne(req.body)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/serviceList', (req, res) => {
        serviceList.find({})
        .toArray((err,result) => {
            console.log(err);
            res.send(result)
        })
    })
    app.get('/serviceList/:id', (req, res) => {
        serviceList.find({_id: ObjectID(req.params.id)})
        .toArray((err,result) => {
            console.log(err);
            res.send(result)
        })
    })
    
    app.delete('/delete/:id' , (req, res) => {
        console.log(req.params.id);
        serviceList.deleteOne({_id : ObjectID(req.params.id)})
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0)
        })
    })

    app.post('/addOrder', (req, res)=>{
        orderList.insertOne(req.body)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/usersOrder', (req, res)=>{
        console.log(req.query.email);
        orderList.find({email:req.query.email})
        .toArray((err,result) => {
            console.log(err);
            res.send(result)
        })
    })

    app.get('/orders', (req, res)=>{
        orderList.find({})
        .toArray((err,result) => {
            console.log(err);
            res.send(result)
        })
    })

});

app.get("/", (req, res) => {
    res.send('hello ')
})

app.listen(process.env.PORT || 5000);