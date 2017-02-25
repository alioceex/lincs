const express = require('express')
const router = express.Router()
const Matrix = require('../models/matrix')
const Metadata = require('../models/metadata')
const async = require('async')
const csv = require("fast-csv")

router.use(function(req, res, next) {
    console.log('Loading...');
    next();
});

router.get('/tags', (req, res, next) => {

  let queries = []
  queries.push(function (cb) {
    Metadata.distinct('CL_Name').then( (docs) => {
        cb(null, docs)
    });
  })

  queries.push(function (cb) {
    Metadata.distinct('SM_Name').then( (docs) => {
        cb(null, docs)
    });
  })

  async.parallel(queries, function(err, docs) {
    if (err) {
        throw err
    }

    var obj1 = [];
    docs[0].forEach(function(tag, i){
       obj1[i] = {name: 'CL_Name', tag}
    })

    var obj2 = [];
    docs[1].forEach(function(tag, i){
       obj2[i] = { name: 'SM_Name', tag}
    })

    res.json(obj1.concat(obj2))
  })

})

router.post('/search', (req, res, next) => {

  let data = req.body

  let fields = []
  data.values.forEach( (d, i) => {
    let values = {}
    values[d.name] = d.tag
    fields.push(values)
  })

  let options = {
    page: data.page,
    limit: data.limit
  }

  Metadata.paginate({$or:fields}, options).then( (model) => {
    let data = {
      model
    }
    res.json(data)
  })


})


// Download

router.post('/download', (req, res, next) => {

  let filename = 'matrix.csv'
  res.setHeader('Content-disposition', 'attachment; filename=' + filename)
  res.setHeader('content-type', 'text/csv')

  let csvStream = csv.createWriteStream({
      headers: true,
      objectMode: true,
      transform: function (row) {
        return row
      }
  })

  let data = req.body
  Matrix.find({id: { $in: data }}, {id: 1, vector: 1}).then( (results) => {

    results.forEach( (r) => {
      csvStream.write(
        r.vector
      )
    })
    csvStream.end()
    csvStream.pipe(res)

  })


})

module.exports = router
