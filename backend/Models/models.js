const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({

   id: {
      type: Number,
      required: true
   },

   creator: {
      type: String,
      required: true
   },

   title: {
      type: String,
      required: true
   },

   description: {
      type: String,
      required: true
   },

   snippet: {
      type: String,
      required: true
   },

   thumbnail: {
      type: String,
      required: true
   },

   startAt: {
      type: String,
      required: true
   },

   endAt: {
      type: String,
      required: true
   },
   goal: {
      type: Number,
      required: true
   },
   nbOfInvestors: {
      type: Number,
      required: false
   },
   pledged: {
      type: Number,
      required: false
   },
   claimed: {
      type: Boolean,
      required: true
   }

}, {timestamps: true});

const Campaign = mongoose.model("Campaign", CampaignSchema);

const StakeSchema = new Schema({
   user: {
      type: String,
      required: true,
   },
   amount: {
      type: String,
      required: true
   },
   claimed: {
      type: Boolean,
      required: true
   },
   date: {
      type: String,
      require: true
   }
})

const Stake = mongoose.model("Stake", StakeSchema);


module.exports = {Campaign, Stake}