const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Todo} = require('../models/Todo');

const todos  = [{
  _id: new ObjectID(),
  text: "First test"
}, {
  _id: new ObjectID(),
  text: "Second test"
}]



beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done());
});

describe("Post todo", ()=>{
  it("should create new todos", (done)=>{
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

  describe("GET /todos", ()=> {
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

  describe("GET /todos/id", ()=> {
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
describe("DELETE /todos/:id", () => {
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
