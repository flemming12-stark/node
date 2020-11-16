
module.exports = class query {
    constructor(indexname, querytype, query={}, wherecond='') {
        this.indexname = indexname;
        this.querytype = querytype;
        this.query = query;
        this.wherecond = wherecond;
        this.createcon = {};
    }
    dbconnection(callback) {
        this.createcon = mysql.createConnection({
            host: db.host,
            user: db.user,
            password: db.password
        });
        this.createcon.connect(err=>{
            if(!err) {
                console.log('Db connected');
                callback(false);
            } else {
                callback(err);
            }
        });
    }

    dbcall(callback) {
        this.dbconnection(err=>{
            if (err) {
                callback(err,{});
            } else {
                let formedQuery = '';
                switch(this.querytype) {
                    case "INSERT":
                        let queryForm = "INSERT INTO "+db.database+"."+this.indexname;
                        let column = [];
                        let value = [];
                        for(let key in this.query) {
                            if(this.query[key]) {
                                column.push(key);
                                value.push("'"+this.query[key]+"'");
                            }
                        }
                        formedQuery = queryForm+" ("+column.toString()+") VALUES ("+value.toString()+");"
                        break;
                    case "READ":
                        let ReadQuery = "SELECT * FROM "+db.database+"."+this.indexname;
                        let filter = '';
                        for(let key in this.query) {
                            if(this.query[key]) {
                                if(filter !="") {
                                    filter +=" AND";
                                }
                                filter += " "+key+' IN ("'+this.query[key]+'")';
                            }
                        }   
                        formedQuery = ReadQuery+" WHERE "+filter+";";
                        break;
                    case "UPDATE":
                        let updateQuery = "UPDATE "+db.database+"."+this.indexname+" SET ";
                        let queryFilter = '';
                        for(let key in this.query) {
                            if(this.query[key] && key != "UserId") {
                                if(queryFilter == '') {
                                    queryFilter += key +" = '"+this.query[key]+"'";
                                } else {
                                    queryFilter += " , "+key +" = '"+this.query[key]+"'";
                                }
                            }
                        }
                        if(queryFilter != '') {
                            queryFilter += " WHERE username IN ('"+this.query["UserId"]+"')";
                        }
                        formedQuery = updateQuery+queryFilter;
                        break;
                    case "DELETE":
                        formedQuery = "DELETE FROM "+db.database+"."+this.indexname+" WHERE username IN ('"+this.query["UserId"]+"')";
                        break;
                }
                this.checkForInjection(formedQuery,(validquery)=>{
                    if(validquery) {
                        console.log('=>>>>>>>>>>', formedQuery);
                        this.createcon.query(formedQuery,(err,result)=>{
                            if(err) {
                                callback(err,{});
                            } else {
                                callback(null,result);
                            }
                        });
                    } else {

                    }
                });
            }
        })
    }

    checkForInjection(query,callback){
        let validQuery = true;
        let injectarray = [" UNION ALL ", " INTO OUTFILE ", " LOAD_FILE ", " INFORMATION_SCHEMA ", " SHOW TABLES ", " SHOW DATABASES ", " CHAR(", " @@VERSION", " -999.9", " -9.9", " x=x", " x=y", " WAITFOR DELAY", " hex(", "(1=1", " 1=1"];
        for(let value of injectarray) {
            if(query.includes(value)) {
                validQuery = false;
                break;
            }
        }
        callback(validQuery);
    }
}