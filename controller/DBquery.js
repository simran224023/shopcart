const conn = require('../Includes/connection')
function getIndexPage(req, res) {
    const sql = "select * from categories";
    conn.query(sql,(err,result)=>{
        if(err) throw err;
        res.render('index', { data: result })
    })
    
}

  module.exports={getIndexPage}