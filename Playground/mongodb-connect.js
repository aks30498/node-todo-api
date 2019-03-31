const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log("Unable to connect to the database");
  }
  console.log("connected to MongoDB server");

  // db.collection('Todos').insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, res) => {
  //     if(err){
  //       return console.log('Unable to insert todo', err);
  //     }
  //
  //     console.log(JSON.stringify(res.ops, undefined, 2));
  // })

  db.collection('Users').insertOne({
    name: "Slayer",
    age: 20,
    location: "India"
  }, (err, res) => {
    if(err){
      return console.log("Unable to insert data", err);
    }

    console.log(JSON.stringify(res.ops, undefined, 2));
  })

  db.close();
});
