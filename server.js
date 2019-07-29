const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = process.env.PORT || 4000;
let Todo = require("./todo.model");
app.use(cors());
app.use(bodyParser.json());
mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.get("/", function(req, res) {
  res.redirect("/todos");
});

app.post("/", function(req, res) {
  res.redirect("/todos");
});

todoRoutes.get("/", function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});
todoRoutes.get("/:id", function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});
todoRoutes.post("/update/:id", function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.name = req.body.name;
    todo.todo_message = req.body.todo_message;
    todo
      .save()
      .then(todo => {
        res.json("Todo updated!");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});
todoRoutes.post("/add", function(req, res) {
  let todo = new Todo(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});
app.use("/todos", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
