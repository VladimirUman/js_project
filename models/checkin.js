const mongoose = require('mongoose');

const Schema = mongoose.Schema;
  // ObjectId = Schema.ObjectId;

const Checkins = new Schema({
    name: {
        type: String,
        required: true
    },
    place: String,
    cord: {
    	lat:Number,
    	lng:Number
    }
});

module.exports = Checkins;
