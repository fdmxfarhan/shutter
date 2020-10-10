const mongoose = require('mongoose');
const dotenv = require('dotenv');

// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT_EXCEPTION!   Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

const DB = 'mongodb+srv://fdmxfarhan:nuRamueoSXTJRWni@cluster0-b8rpp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(DB,{ useNewUrlParser: true , useUnifiedTopology: true});
mongoose.connection.once('open', function(){
  console.log('DataBase is connected.   ');
  

}).on('error', function(error){
  console.log('Connection error:', error);
});


// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || '127.0.0.1';
const server = app.listen(port, () => {
  console.log(`Listening On http://${domain}:${port} ...!`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED_REJECTION!   Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log(' Proccess Terminated ');
  });
});
