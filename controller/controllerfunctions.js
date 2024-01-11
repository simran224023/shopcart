const conn = require('../Includes/connection')
const services = require('../controller/Services');

function IndexPage(req, res) {
    services.getCategoryProducts(req,res);
}


function ProductPage(req,res){
    services.getProducts(req,res);
}

function ViewMore(req,res){
    services.getViewMore(req,res);
}


function SearchPage(req,res){
    services.getSearchProducts(req,res)
}


  module.exports={IndexPage,ProductPage,ViewMore,SearchPage}