const express = require("express");
const router = express.Router();
const controller = require("../controllers/messagesController");

router.route("/").get(controller.findAll).post(controller.create);

router
  .route("/:id")
  .get(controller.findById)
  .delete(controller.remove)
  .put(controller.update);

module.exports = router;
