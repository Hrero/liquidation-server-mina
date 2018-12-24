var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlMap');//sql语句

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect(err => {
    if(err){
        console.log(`mysql连接失败: ${err}!`);
    }else{
        console.log("mysql连接成功!!~");
    }
});
var responseData;

router.use(function (req,res,next) {
    responseData = {
        code:0,
        msg: ''
    }
    next()
})
var jsonWrite = function(obj) {
    console.log(obj)
    if(typeof obj.data === 'undefined') {
        obj.res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        responseData.code = obj.code
        responseData.msg = obj.msg
        responseData.data = obj.data
        responseData.result = obj.result
        obj.res.json(responseData);
    }
};
router.post('/getDissSelect', (req, res) => {
    var sql = $sql.disclose.disclose
    var params = req.body
    console.log(params)
    conn.query(sql, function(err, result) { 
        if (err) {
            console.log(err);
        }
        console.log(result)
        if (result) {
            jsonWrite({res: res, data: result, msg: '', code: 1, result: true});
            res.end('is over');
        }
    })
})
router.post('/getRankingList', (req, res) => {
    var sql = $sql.ranking.ranking
    var params = req.body
    conn.query(sql, function(err, result) { 
        if (err) {
            console.log(err);
        }
        console.log(result)
        if (result) {
            jsonWrite({res: res, data: result, msg: '', code: 1, result: true});
            res.end('is over');
        }
    })
})
// 添加接口
router.post('/addCompany', (req, res) => {
    var sql = $sql.addCompany.add;
    // var sql2 = $sql.repetition.companyName;
    var params = req.body;
    var sql2 = $sql.name(params.name);
    conn.query(sql2,function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length < 1) {
            conn.query(sql, [params.name,params.number,params.region,params.isGoOut,params.hopeGoOut,params.existence,params.diss,params.talk,params.star], function(err, result) { 
                if (err) {
                    console.log(err);
                }
                if (result) {
                    jsonWrite({res: res, data: result, msg: '收到了,老板', code: 1, result: true});
                    res.end('is over');
                }
            })
        } else {
            jsonWrite({res: res, data: '', msg: '我要被你点爆了', code: 1, result: false});
        }
    })
})
// 增加用户接口
router.post('/login', (req, res) => {
    // var sql = $sql.user.add;
    var params = req.body;
    console.log(params)
    // conn.query(sql, function(err, result) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     if (result) {
    //         console.log(result)
    //         // jsonWrite(res, result);
    //         // for(var i = 0; i < result.length; i++){
    //         //     console.log("请求回来！",result[i])
    //         //     console.log("请求结果！",typeof result[i],result[i].userpsw);
    //         //     if (result[i].userpsw == params.userpsw) {
    //         //         res.send("返回回来了！");
    //         //     }
    //         // }
    //         res.end('is over');
    //     }
    // })
})
// 点赞接口
router.post('/addStar', (req, res) => {
    var params = req.body;
    var sql = `UPDATE company SET star = ${params.star} WHERE id = ${params.id}`
    console.log(params)
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite({res: res, data: result, msg: '收到了,老板', code: 1, result: true});
            res.end('is over');
        }
    })
})
module.exports = router