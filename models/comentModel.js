const mongoose = require('mongoose');

const Schema = mongoose.Schema;
  // ObjectId = Schema.ObjectId;

const ComentSchema = new Schema({
    checkinId: String,
    name: {
        type: String,
        required: true
    },
    text: {
      type: String,
      //required: true
    },
    raiting: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    created: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model('Coment', ComentSchema, 'coments');
