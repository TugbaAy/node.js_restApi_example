const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const db = process.env.mongoURI;

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');
const orderRoutes = require("./api/routes/orders");


var uri = "mongodb://node-shop:" + process.env.MONGO_ATLAS_PW + "@node-rest-shop-shard-00-00-3ldzm.mongodb.net:27017,node-rest-shop-shard-00-01-3ldzm.mongodb.net:27017,node-rest-shop-shard-00-02-3ldzm.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

console.log("mongoose connection state - " + mongoose.connection.readyState);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT',
            'POST',
            'PATCH',
            'DELETE',
            'GET');

        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;