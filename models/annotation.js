const mongoose = require('mongoose')
const config = require('../config/database')

const Schema = mongoose.Schema;

const annotationSchema = new Schema({
    "id" : String,
    "pr_analyte_id" : String,
    "pr_analyte_num" : String,
    "pr_bset_id" : String,
    "pr_gene_id" : String,
    "pr_gene_symbol" : String,
    "pr_gene_title" : String,
    "pr_is_bing" : String,
    "pr_is_inf" : String,
    "pr_is_lmark" : String,
    "pr_lua_id" : String,
    "pr_model_id" : String,
    "pr_pool_id" : String
});

module.exports = mongoose.model('Annotation', annotationSchema, 'annotation')
