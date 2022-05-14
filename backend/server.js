const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const Campaign = require('./Models/models');

const app = express();
const dbURI = "mongodb+srv://ralph:Mirororo1@cluster0.cuxvq.mongodb.net/Campaigns?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(result => app.listen(8080))
   .catch(err => console.log(err));
   

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/add-campaign', (req, res) => {
   const campaign = new Campaign({
      id: 0,
      creator: "New Creator",
      title: "New title",
      snippet: "New snippet",
      description: "New description",
      thumbnail: "New thumbnail",
      startAt: "New startAt",
      endAt: "New endAt"
   });

   campaign.save()
      .then(result => {
         res.send(result)
      })
      .catch(err => {
         console.log(err);
      })
})

app.get('/all-campaigns', (req, res) => {
   res.header("Access-Control-Allow-Origin", "*");
   Campaign.find()   
      .then(result => {
         res.send(result)
      })
      .catch(err => {
         console.log(err);
      })
})

