const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log("Unable to connect to the database");
  }
  console.log("connected to MongoDB server");

  // db.collection('Todos').find({_id: new ObjectID('5ca060185f3cc308ec897bee')}).toArray().then((docs)=>{
  //   console.log("To dos");
  //   console.log(JSON.stringify(docs,undefined,2));
  // }, (err) => {
  //   console.log("Unable to fetch todos", err);
  // })

  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`To dos count ${count}`);
  // }, (err) => {
  //   console.log("Unable to fetch todos", err);
  // })

  db.collection('Users').find({name: "Akshay"}).toArray().then((docs)=>{
    console.log("Users with the specified name:");
    console.log(JSON.stringify(docs,undefined,2));
  }, (err) => {
    console.log("Unable to fetch users", err);
  })


});
