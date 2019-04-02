var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/TodoApp", {useNewUrlParser: true}).catch((e) => {
  console.log(e);
});

module.exports ={mongoose};
