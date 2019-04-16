const {ObjectID} = require('mongodb');
const {Todo} = require('../../models/Todo');
const {User} = require('../../models/User');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const todos  = [{
  _creator: userOneId,
  _id: new ObjectID(),
  text: "First test",
  completed: true,
  completedAt: 123456
}, {
    _creator: userTwoId,
  _id: new ObjectID(),
  text: "Second test"
}];

const users = [
  {
    _id: userOneId,
    email: "aks30498@gmail.com",
    password: "userOnePass",
    tokens: [{
      access: "auth",
      token: jwt.sign({_id: userOneId, access:'auth'}, 'abc123').toString()
    }]
  },{
    _id: userTwoId,
    email: "aks@gmail.com",
    password: "userTwoPass",
    tokens: [{
      access: "auth",
      token: jwt.sign({_id: userTwoId, access:'auth'}, 'abc123').toString()
    }]
  }
]

const populateTodos = function(done){
  this.timeout(50000);
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done()).catch((e) => {
    console.log(e);
  });
}

const populateUsers = function(done){
  this.timeout(50000);
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
