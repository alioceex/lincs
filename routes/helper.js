"use strict"
const Matrix = require('../models/matrix')
const async = require('async')

function writeFile(csvStream, data) {

  function loop(data) {

    Matrix.find({id: { $in: data }}, {id: 1, vector: 1}).then( (results) => {

      results.forEach( (r, i) => {
        if(++i < results.length)
          csvStream.write({
            [r.id]: r.vector
          })
        else{
          csvStream.end()
        }
      })

    })

  }

  loop(data)
}

function writeSync(csvStream) {
  var i = -1, max = 5;
  
  while(++i < max) {
    csvStream.write({
      "col1": "value1-"+i,
        "col2": "value2-"+i,
        "col3": "value3-"+i,
        "col4": "value4-"+i
    });
  }
  
  // End the stream by hand.  
  // If you pipe a readable stream into the CSV stream
  // this step is not necessary.
  csvStream.end();
}

// fake latency as if something was writing
function writeAsync(csvStream) {
  var i = -1, max = 5, timer;
  
  function loop() {
    clearTimeout(timer);
    if (++i < max) {
      csvStream.write({
        "col1": "value1-"+i,
        "col2": "value2-"+i,
        "col3": "value3-"+i,
        "col4": "value4-"+i
      });
      timer = setTimeout(loop, 1000);
    } else {
      csvStream.end();
    }
  }
  
  // start writing once a second until we've written 5 times
  loop();
}

module.exports = {
  writeSync: writeSync,
  writeAsync: writeAsync,
  writeFile
};

