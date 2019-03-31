const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log("Unable to connect to the database");
  }
  console.log("connected to MongoDB server");

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5ca067aa24cd718fa7957745")
  // },{
  //   $set:{
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5ca060e6cc682d15d8e282ce")
  },{
    $inc: {age: 1},
    $set: {name: "Slayer"}
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })

  //db.close();
});
