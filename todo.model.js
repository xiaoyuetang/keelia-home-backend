const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Todo = new Schema({
  name: {
    type: String
  },
  message: {
    type: String
  },
  time: {
    type: Object
  }
});
module.exports = mongoose.model("Todo", Todo);
