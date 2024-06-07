const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

// GET ALL THE TODOS
router.get("/", (req, res) => {
  Todo.find({})
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
          message: "todo list loaded",
          data,
        });
      }
    });
});

// GET ACTIVE TODOS
router.get("/active", async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({ data });
});

// GET JS TODOS
router.get("/js", async (req, res) => {
  const data = await Todo.findByJs();
  res.status(200).json({ data });
});
// GET  TODOS BY LANGUAGE
router.get("/language/:lang", async (req, res) => {
  const data = await Todo.find().byLanguage(req.params.lang);
  res.status(200).json({ data });
});

// GET A TODO by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      message: "todo item loaded",
      data,
    });
  } catch (error) {
    res.status(200).json({
      message: error,
    });
  }
});

// POST A TODO
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
    } else {
      res.status(200).json({
        message: "todo created",
      });
    }
  });
});

// POST MULTIPLE TODO
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        message: err,
      });
    } else {
      res.status(200).json({
        message: "todo list added",
      });
    }
  });
});

// PUT TODO
router.put("/:id", async (req, res) => {
  await Todo.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: "active",
      },
    },
    (err) => {
      if (err) {
        res.status(500).json({
          message: err,
        });
      } else {
        res.status(200).json({
          message: "todo updated",
        });
      }
    }
  );
});

// DELETE TODO
router.delete("/:id", (req, res) => {});

module.exports = router;
