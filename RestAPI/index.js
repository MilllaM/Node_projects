'use strict';

const path= require('path');
const http= require('http');
const cors= require('cors');  //makes it possible to request data from different origin

const express= require('express');
const app= express();

const port= 3000;
const host= 'localhost';

const server= http.createServer(app);

app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'images')));

//API:
const api=require('./gameApi')();
app.use('/api', api);




/* eslint-disable no-console */
server.listen(port, host, ()=> console.log(`server at port ${port}`));
