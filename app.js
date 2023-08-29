const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());

// To make the BE accept form this Origin 'websites, Postman, ...'; Because FE & BE not in the same server 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*': means accept form any client(ex:codepen.io,...)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // to make the BE know the DataType // which is headers:{'Content-Type':'application/json'}
    next(); // to complete the code
});

app.use('/feed',feedRoutes);

app.listen(8080, console.log("Welcome Sir! From Server"));