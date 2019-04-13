const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Todo} = require('../models/Todo');
const {User} = require('../models/User');
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("Post todo", function(){
  this.timeout(50000);
  it("should create new todos", function(done){
    this.timeout(50000);
    var text = "Todo test";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err , res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should not create a todo with invalid data', (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err ,res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((docs) => {
          expect(docs.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });

  describe("GET /todos", function(){
    this.timeout(50000);

    it("Should get all the todos", (done)=> {
      request(app)
        .get("/todos")
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe("GET /todos/id", function(){
    this.timeout(50000);

    it("Should get one document by id", (done)=> {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it("Should get 404 if address not found", (done)=> {
      var hexid = new ObjectID().toHexString();

      request(app)
        .get(`/todos/${hexid}`)
        .expect(404)
        .end(done);
    });

    it("Should get 404 if address not valid", (done)=> {
      request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
  });
});
describe("DELETE /todos/:id", function(){
  this.timeout(50000);

  it("Should delete a todo", (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId)
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }

      var todo = Todo.findById(hexId).then((res)=>{
        expect(res).toBeFalsy();
        done();
      },(e) => {
        return done(err);
      });
    });
  });

  it("Should give 404 if todo is not deleted", (done) => {
      var hexId = new ObjectID().toHexString();
        request(app)
          .delete(`/todos/${hexId}`)
          .expect(404)
          .end(done);
      });

  it("Should give 404 when invalid address in passed", (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', function(){
    this.timeout(50000);

    it("Should update a todo ",(done)=> {
      var id = todos[0]._id.toHexString();
      var text = "New Text";

      request(app)
        .patch(`/todos/${id}`)
        .send({text, completed: true})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);

    });

    it("Should clear the completedAt when todo not completed", (done) => {
      var id = todos[1]._id.toHexString();
      var text = "New Text!";

      request(app)
        .patch(`/todos/${id}`)
        .send({text, completed: false})
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeFalsy();
        })
        .end(done);
    });
  });

  describe("GET/ users/me", function(){
    this.timeout(5000);
    it("Gives user data if token given", (done) => {
      request(app)
        .get("/users/me")
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it("Should give 401 if token can't be authencated", (done) => {
      request(app)
        .get("/users/me")
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe("POST users/", function(){
    this.timeout(5000);

    it("Should sign up a new user", (done) => {
      var email = "ex@ex.com";
      var password = "123abc";
      request(app)
        .post("/users")
        .send({email, password})
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if(err){
            done(err);
          }
          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
          })
          done();
        });
    });

    it("Should show error if invalid details are given", (done) => {
      var email = "ex@ex.com";
      var password = "3abc";
      request(app)
        .post("/users")
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it("Should show error if email is already in use", (done) => {
      var email = users[0].email;
      var password = "123abc";
      request(app)
        .post("/users")
        .send({email, password})
        .expect(400)
        .end(done);
    });
  });
