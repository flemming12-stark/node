let queryfile = require('../../db/queryfiles.js');

module.exports = (req, res, throwError) => {
    try {
        let REQUEST = {};
        REQUEST = Object.create(Object.assign(req.query,req.body));
        let queryDetail = {};
        queryDetail = {
            "UserId" : REQUEST.UserId,
            "ProfileStatus": 1
        }
        let action = 'UPDATE';
        if(REQUEST.delete == 2) {
            action = 'DELETE';
        }
        let query = new queryfile(db.indexName, action, queryDetail);
        query.dbcall((err,result)=>{
            let Response = {};
            Response.ERRCODE = '0';
            Response.Message = '';
            if(err) {
                Response.Message = 'Something went Wrong';
            } else {
                Response.ERRCODE = '0';
                Response.Message = 'Success';
            }
            return res.status(200)
            .set('Content-Type', 'application/json')
            .json(Response)
            .end();
        })

    } catch(err) {
        throwError(err);
    }
};