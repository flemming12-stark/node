let queryfile = require('../../db/queryfiles.js');

module.exports = (req, res, throwError) => {
    try {
        let REQUEST = {};
        REQUEST = Object.create(Object.assign(req.query,req.body));
        if(REQUEST.UserId) {
            let queryDetail = {};
            let userid = '';
            if(REQUEST.UserId.includes("@")) {
                userid = "Email";
            } else {
                userid = "UserName";
            }
            queryDetail = {
                [userid] : REQUEST.UserId
            }
            let query = new queryfile(db.indexName, 'READ', queryDetail);
            query.dbcall((err,result)=>{
                let Response = {};
                Response.ERRCODE = '0';
                Response.Message = '';
                if(err) {
                    // if(err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
                        Response.ERRCODE = '1';
                    //     if(err.sqlMessage.includes('username')) {
                    //         Response.Message = 'Duplicate UserName';
                    //     } else if (err.sqlMessage.includes('Email')) {
                    //         Response.Message = 'Duplicate Email';
                    //     }
                    // } else {
                        Response.Message = 'Something went Wrong';
                    // }
                } else {
                    let data = result[0];
                    let res = {};
                    res.Name = data.Name;
                    res.Gender = data.Gender == 'M' ? 'Male' : 'Female';
                    res.Address = data.Address ? data.Address : '';
                    res.Email = data.Email;
                    Response.ERRCODE = '0';
                    Response.ProfileDetail = res;
                }
                return res.status(200)
                .set('Content-Type', 'application/json')
                .json(Response)
                .end();
            })

        } else {
            let Response = {
                ERRCODE: "1"
            }
            return res.status(200)
            .set('Content-Type', 'application/json')
            .json(Response)
            .end();

        }

    } catch(err) {
        throwError(err);
    }
};