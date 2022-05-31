const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const Campaign = require("./Models/models");
var cors = require("cors");
const { Stake } = require("./Models/StakeModel");

const app = express();
const dbURI =
  "mongodb+srv://ralph:Mirororo1@cluster0.cuxvq.mongodb.net/Campaigns?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/all-campaigns", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  Campaign.Campaign.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/addCampaign", async (req, res, next) => {
  Campaign.Campaign.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

app.post("/updateCampaign", async (req, res) => {
  const filter =  {id: req.body.id};
  let updateDoc = {};
  if (req.body.incInvestors) {
    updateDoc = {
      pledged: req.body.amount,
      $inc: {
        nbOfInvestors: 1
      }
    }
  } else {
    updateDoc = {pledged: req.body.amount};
  }
  console.log('doc', updateDoc);
  const result = await Campaign.Campaign.updateOne(filter, updateDoc);
  console.log(result.matchedCount);
})

app.post("/claimCampaign", async (req, res) => {
  const filter = {id: req.body.id}
  let updateDoc = {claimed: true};
  const result = await Campaign.Campaign.updateOne(filter, updateDoc)
  console.log(result.matchedCount);
})

app.post("/addStake", async (req, res) => {
  Campaign.Stake.create(req.body, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
})

app.get("/getStakes", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  Campaign.Stake.find({ user: req.query.user})
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
})
