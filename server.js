require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
const port = 3000;

app.get("/", (req, res) => {
  res.render("index", [{ name: "Harish" }]);
});

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.once("open", () => console.log("Connected to Database"));
db.on("error", (error) => console.error(error));

const userRouter = require("./routes/users");
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
