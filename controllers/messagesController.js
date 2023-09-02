const Message = require("../models/message");

module.exports = {
  findAll: function (req, res) {
    Message.find(req.query)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  findById: function (req, res) {
    Message.findById(req.params.id)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    Message.create(req.body)
      .then((dbModel) => res.status(201).json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  update: async function (req, res) {
    try {
      const message = await Message.findById(req.params.id);
      message.sender = req.body.sender;
      message.receiver = req.body.receiver;
      message.content = req.body.content;
      message.datetime = new Date(req.body.datetime);
      message.status = req.body.status;
      message.save();
      res.json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  remove: async function (req, res) {
    try {
      const user = await Message.findById(req.params.id);
      await user.deleteOne();
      res.status(204).json({ message: "Deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
