const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const dotenv = require("dotenv");
// express app initialization
const app = express();

dotenv.config();
app.use(express.json());

// database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(3000, () => {
  console.log("app listening at port 3000");
});
