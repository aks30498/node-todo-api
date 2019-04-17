var env = process.env.NODE_ENV || 'development';

if(env === "development" || env === "test"){
  const config = require('./config.json');
  var envObject = config[env];
  Object.keys(config[env]).forEach((key) => {
    process.env[key] = envObject[key];
  })
}
