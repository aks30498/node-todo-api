const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
  if(err){
    return console.log("Unable to connect to the database");
  }
  console.log("connected to MongoDB server");

  //deleteMany
  // db.collection('Todos').deleteMany({text: "Laddu"}).then((result) => {
  //   console.log(result);
  // });
  // //deleteOne
  // db.collection('Todos').deleteOne({text: "same"}).then((result) => {
  //   console.log(result);
  // });
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  //challenge
  // db.collection('Users').deleteMany({name: "Slayer"}).then((res) => {
  //   console.log(res);
  // });
  db.collection('Users').findOneAndDelete({_id: new ObjectID("5ca069b6a7293f25e40bcadd")}).then((res) => {
    console.log(JSON.stringify(res,undefined,2));
  });

  //db.close();
});
