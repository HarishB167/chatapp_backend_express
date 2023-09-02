const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  status: {
    type: String,
  },
});

messageSchema.methods.toString = function () {
  const userName = this.name;
  print("User name is : " + userName);
  return (
    "Id: " +
    this._id +
    ", ReceiverId: " +
    this.receiver +
    ", SenderId: " +
    this.sender +
    ", DateTime: " +
    this.datetime +
    ", Status: " +
    this.status +
    ", Content: " +
    this.content
  );
};

module.exports = mongoose.model("Message", messageSchema);
