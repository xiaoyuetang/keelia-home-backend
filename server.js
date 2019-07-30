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
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000
};
mongoose.connect(
  "mongodb+srv://dbUser:tangxiaoyue@cluster0-nh1sr.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);
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
  Todo.sort({ time: "desc" }).find(function(err, todos) {
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
    todo.message = req.body.message;
    todo.time = req.body.time;
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

todoRoutes.delete("/:id", function(req, res) {
  Todo.remove(
    {
      _id: req.params.id
    },
    function(err, bear) {
      if (err) res.send(err);

      res.json({ message: "Successfully deleted" });
    }
  );
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

app.listen(PORT, "0.0.0.0", function() {
  console.log("Server is running on Port: " + PORT);
});
