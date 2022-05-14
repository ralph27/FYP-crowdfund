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

}, {timestamps: true});

const Campaign = mongoose.model("Campaign", CampaignSchema);
module.exports = Campaign