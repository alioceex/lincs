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



module.exports = {
  writeFile
}
