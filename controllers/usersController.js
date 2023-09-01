const User = require("../models/user");

module.exports = {
  findAll: function (req, res) {
    User.find(req.query)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  findById: function (req, res) {
    User.findById(req.params.id)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    User.create(req.body)
      .then((dbModel) => res.status(201).json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  update: async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      user.name = req.body.name;
      user.email = req.body.email;
      user.photoLink = req.body.photoLink;
      user.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  remove: async function (req, res) {
    try {
      const user = await User.findById(req.params.id);
      await user.deleteOne();
      res.status(204).json({ message: "Deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
