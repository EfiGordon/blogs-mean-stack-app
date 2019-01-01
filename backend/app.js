const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect("mongodb+srv://efigordon90:" + process.env.MONGO_ATLAS_PASSWORD + ".mongodb.net/node-angular-db?retryWrites=true",
  {
    useNewUrlParser: true
  })
  .then(() => {
  console.log('connected to DB');
}).catch(() => {
  console.log('connection to DB was failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();

});
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/",(req, res, next) => {
  res.send('Welcome to localhost, this is a private area, so please <br><b> get the hell out of here</b>.');
}
)


module.exports = app;
