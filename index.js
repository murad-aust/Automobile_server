const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://root:murad20@cluster0.us2jj.mongodb.net/car?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
require('dotenv').config()
const app = express()
const port = 5000

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());


client.connect(err => {
    const carCollection = client.db("automobile").collection("car");


    app.get('/car', (req, res) =>{
        carCollection.find({})
        .toArray((err, documents) =>{
            
             res.send(documents);
        })
    })

    app.post('/addCar', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const brand= req.body.brand;
        const details = req.body.details;
  
        console.log(file , name, brand, details);
  
        const newImg = file.data;
        const encImg = newImg.toString('base64');
  
        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };
  
        carCollection.insertOne({name, brand, details, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
  })

  app.get('/newCar', (req, res) =>{
    carCollection.find({}).sort({_id:-1}).limit(1)
    .toArray((err, documents) =>{

         res.send(documents);
    })
})
app.delete('/delete/:id',(req, res) =>{
    
    carCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result =>{
      
      res.send(result.deletedCount >0);

    })
  })

});


app.listen(process.env.PORT||port )
