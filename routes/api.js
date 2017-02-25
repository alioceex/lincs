"use strict"
const express = require('express')
const router = express.Router()
const Matrix = require('../models/matrix')
const Metadata = require('../models/metadata')
const Annotation = require('../models/annotation')
const async = require('async')
const csv = require("fast-csv")
const helper = require('./helper')
const fs = require('fs')
const archiver = require('archiver')

router.use(function(req, res, next) {
    console.log('Loading...');
    next();
});

router.get('/tags', (req, res, next) => {

  let queries = []
  queries.push(function (cb) {
    Metadata.distinct('CL_Name').then( (docs) => {
        cb(null, docs)
    })
  })

  queries.push(function (cb) {
    Metadata.distinct('SM_Name').then( (docs) => {
        cb(null, docs)
    })
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

router.get('/download/:ids', (req, res, next) => {

  let filename = 'results.zip'
  res.setHeader('Content-disposition', 'attachment; filename=' + filename)
  res.setHeader('content-type', 'application/zip, application/octet-stream')

  let archive = archiver('zip', {
      store: true
  })

  archive.on('error', function(err) {
    throw err
  })

  let data = req.params.ids.split(',')

  let queries = []
  queries.push(function (cb) {
    Annotation.find({}, {_id: 0, pr_gene_symbol: 1}).then( (results) => {
        cb(null, results)
    })
  })

  queries.push(function (cb) {
    Matrix.find({id: { $in: data }}, {_id: 0}).then( (results) => {
        cb(null, results)
    })
  })

  async.parallel(queries, function(err, results) {
    if (err) {
        throw err
    }

    let symbols = results[0].map(function(s) { return s.pr_gene_symbol })

    let csvStream = csv.createWriteStream({
      headers: ['gene_symbols', symbols],
      objectMode: true,
      quote: ' ',
      transform: function (row) {
        return row
      }
    })

    results[1].forEach( (r) => {
      csvStream.write([
        [r.id], [r.vector]
      ])
    })
    csvStream.end()

    archive.append(csvStream, { name: 'matrix.csv' })
    archive.finalize()
    archive.pipe(res)
  })

})

module.exports = router
