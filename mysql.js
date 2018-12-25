// 数据库连接配置
var mysql = require('mysql');
var db_config={
    host:'localhost',
    user:'root',
    password:'root',
    database:'testapp'
};
var connection=mysql.createConnection(db_config);
handleDisconnect() {
    connection.connect(function (err) {
        // callback(err,result);
        if(err){
            console.log(err);
            console.log("try to connect");
            setTimeout(handleDisconnect,1000);  //经过1秒后尝试重新连接
            return;
        }
        console.log("Success");
    });
}
handleDisconnect()

var userAddSql= "INSERT INTO user(id,name,sex,age) VALUES(?,?,?,?)";
var userAddSql_Params=['413','just','man','9'];

var showuser="SELECT * FROM user";
var deleteuserSql="DELETE FROM user WHERE name='hehe'"

//调用查询方法
connection.query(userAddSql,userAddSql_Params,function(err,result){

    if(err) throw err;

    console.log('show result:',result);
    console.log('show result:',result.affectedRows);

})