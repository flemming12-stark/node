let queryfile = require('../../db/queryfiles.js');

module.exports = (req, res, throwError) => {
    try {
        let REQUEST = {};
        REQUEST = Object.create(Object.assign(req.query,req.body));
        if(REQUEST.UserId && REQUEST.Password) {
            let queryDetail = {};
            let userid = '';
            if(REQUEST.UserId.includes("@")) {
                userid = "Email";
            } else {
                userid = "username";
            }
            queryDetail = {
                [userid] : REQUEST.UserId,
                "Password" : REQUEST.Password
            }
            let query = new queryfile(db.indexName, 'READ', queryDetail);
            query.dbcall((err,result)=>{
                let Response = {};
                Response.ERRCODE = '0';
                Response.Message = '';
                if(err) {
                    Response.ERRCODE = '1';
                    Response.Message = 'Something went Wrong';
                } else {
                    if(result.length >=1) {
                        Response.ERRCODE = '0';
                        Response.Message = 'Success';
                        Response.UserId = result[0].username;
                        if(result[0].ProfileStatus) {
                            Response.ERRCODE = '1';
                            Response.Message = 'Username or Password is wrong';
                        }
                    } else {
                        Response.ERRCODE = '1';
                        Response.Message = 'Username or Password is wrong';
                    }
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