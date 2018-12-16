'use strict';

const path= require('path');
const fs= require('fs');

const routes= require('express').Router();
const levelsPath = path.join(__dirname, 'levels');  //directory we are looking for levels

module.exports= () => {  //empty parenthesis needed, though no parameters used
  routes.get('/', (req, res)=> res.sendStatus(404)); //if someone going to the root level > error

  routes.get('/levels', (req, res)=>   //returning somethign read from a file
    readLevels(levelsPath)
      .then (result => res.json(result))  //sending back the json-results
      .catch(()=> res.sendStatus(404))  //nothing found
  );

  routes.get('/levels/:levelNumber/rooms', (req, res)=> {
    let levelNumber=req.params.levelNumber;
    let folder=`level${levelNumber}`;
    let filepath=path.join(__dirname,'levels',folder);
    readRoomsOfLevel(filepath)
      .then(result => res.json(result))
      .catch(()=> res.sendStatus(404));
  });

  routes.get('/levels/:levelNumber/rooms/:roomNumber', (req, res)=>{
    let levelNumber=req.params.levelNumber;
    let roomNumber=req.params.roomNumber;
    let levelfolder=`level${levelNumber}`;
    let roomfile=`room${roomNumber}.json`;
    let filepath=path.join(__dirname, 'levels', levelfolder, roomfile);
    readRoom(filepath)
      .then(result => res.json(result))
      .catch(()=> res.sendStatus(404));
  });

  return routes;
}; //end of routes


// ***** loacl helpers ****** can be used only inside this API
function readLevels(filepath) {
  return new Promise((resolve, reject)=> {
    fs.readdir(filepath, (err, data)=> {  //gives an array of names in the directory, for more, see node.js docs
      if(err) {
        reject(err);
      }
      else {
        data.sort();
        return resolve(data);
      }
    });
  });
}

function readRoomsOfLevel(filepath) {
  return new Promise((resolve, reject)=> {
    fs.readdir(filepath, (err, data) => {
      if(err) {
        reject(err);
      }
      else {  //will wait until ALL promises...
        Promise.all(data.map(room=>readRoom(path.join(filepath, room))))
          .then(result=>resolve(result));
      }
    });
  });
}

function readRoom(filepath) {  //reads a JSON file & sends the data tot eh caller
  return new Promise((resolve, reject)=> {
    fs.readFile(filepath, 'utf8', (err,data) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(JSON.parse(data));
      }
    });
  });
}


//3 separate functions that will READ their own information
