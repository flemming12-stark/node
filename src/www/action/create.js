let queryfile = require('../../db/queryfiles.js');

module.exports = (req, res, throwError) => {
    try {
        let REQUEST = {};
        REQUEST = Object.create(Object.assign(req.query,req.body));
        let queryDetail = {};
        queryDetail = {
            "Name" : REQUEST.Name,
            "UserName" : REQUEST.UserName,
            "Password" : REQUEST.Password,
            "Gender" : REQUEST.Gender == 'Male' ? 'M' : 'F',
            "Address" : REQUEST.Address,
            "Email" : REQUEST.Email,
        }
        let query = new queryfile(db.indexName, 'INSERT', queryDetail);
        query.dbcall((err,result)=>{
            let Response = {};
            Response.ERRCODE = '0';
            Response.Message = '';
            if(err) {
                if(err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
                    Response.ERRCODE = '1';
                    if(err.sqlMessage.includes('username')) {
                        Response.Message = 'Duplicate UserName';
                    } else if (err.sqlMessage.includes('Email')) {
                        Response.Message = 'Duplicate Email';
                    }
                } else {
                    Response.Message = 'Something went Wrong';
                }
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