const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// GET ALL USERS
router.get("/", (req, res) => {
  User.find({})
    .select({
      __v: 0,
      _id: 0,
    })
    .exec((err, data) => {
      if (err) {
        res.status(500).json({
          message: err,
        });
      } else {
        res.status(200).json({
          message: "User list loaded",
          data,
        });
      }
    });
});

// Create USERS
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: "Signup success",
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
    });
  }
});

// login USERS
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ userName: req.body.userName });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        const token = jwt.sign(
          {
            userName: user[0].userName,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "login success",
          access_token: token,
        });
      } else {
        res.status(401).json({
          message: "Authentication failed",
        });
      }
    } else {
      res.status(401).json({
        message: "Authentication failed",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
    });
  }
});

module.exports = router;
