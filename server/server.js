var env = process.env.NODE_ENV || 'development';

if(env == "development"){
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = "mongodb://localhost:27017/TodoApp";
}else if (env == "test") {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = "mongodb://localhost:27017/TodoAppTest";
  console.log("Test environment!");
}

const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');
const {authenticate} = require("./middleware/authenticate.js");

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/todos", (req, res) => {
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.delete("/todos/:id", (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.patch("/todos/:id", (req,res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  var body = _.pick(req.body, ['text','completed']);

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.post("/users",(req,res)=>{
  var body = _.pick(req.body, ['password','email']);
  var user = new User(body);

  user.save().then(()=>{
     return user.generateAuthToken();
  }).then((token)=>{
     res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

app.get("/users/me", authenticate, (req,res) => {
  res.send(req.user);
})

app.listen(port, () => {
  console.log(`Started at port ${port}`);
});


module.exports ={app};
