const mongoose = require('mongoose');

const Schema = mongoose.Schema;
  // ObjectId = Schema.ObjectId;

const CheckinSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    place: {
      type: String,
      required: [true, 'Why no place']
    },
    description: String,
    cord: {
    	lat:Number,
    	lng:Number
    },
    raiting: {
      type: Number,
      default: 0
    },
    votes: {
      type: Number,
      default: 0
    }
});

module.exports = mongoose.model('Checkin', CheckinSchema, 'checkins');
