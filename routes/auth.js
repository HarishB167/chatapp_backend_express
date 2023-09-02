const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
let refreshTokens = [];

router.get("/users", authenticateToken, async (req, res) => {
  res.json(await User.find());
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = data;
    next();
  });
}

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      photoLink: user.photoLink,
    });
    res.json({ accessToken });
  });
});

router.post("/login", async (req, res) => {
  if (!(req.body.email && req.body.password))
    res.status(400).json({ message: "Provide correct email and password" });

  // Authenticating
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).json({ message: "Cannot find user" });
    return;
  }
  try {
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      res.status(401).json({ message: "Provide correct email and password" });
      return;
    }
  } catch (e) {
    res.sendStatus(500);
  }

  // JWT token generating
  const userData = {
    name: user.name,
    email: user.email,
    photoLink: user.photoLink,
  };

  const accessToken = generateAccessToken(userData);
  const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

router.post("/register", async (req, res) => {
  const getBcryptHash = async (text) => {
    return await bcrypt.hash(text, 10);
  };

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    photoLink: req.body.photoLink,
    password: req.body.password && (await getBcryptHash(req.body.password)),
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

module.exports = router;
