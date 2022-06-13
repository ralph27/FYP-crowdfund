const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("mongoose");
const Campaign = require("./Models/models");
var cors = require("cors");
const multer = require("multer");
var fs = require('fs');
var path = require('path');

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

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

let upload = multer({ storage: storage});

app.get("/all-campaigns", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.query);
  Campaign.Campaign.find({startAt: {$lt: req.query.date}, endAt: {$gt: req.query.date}})
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
    console.log('incing investors');
    updateDoc = {
      pledged: req.body.amount,
      $inc: {
        nbOfInvestors: 1
      },
      $push: { investors: req.body.wallet}
    }
  } else {
    console.log('not incing investors');
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
  Campaign.Stake.find({ user: req.query.user, claimed: false})
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  });
})

app.post("/claimStake", async (req, res) => {
  const filter = {_id:  req.body.id};
  const updateDoc = {claimed: true};
  const result = await Campaign.Stake.updateOne(filter, updateDoc);
})

app.get("/getProfile", async (req, res) => {
  console.log(req.query);
  Campaign.Campaign.find({investors: req.query.address})
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  })
})

app.get("/getCreated", async (req, res) => {
  Campaign.Campaign.find({creator: req.query.address})
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.log(err);
  })
})