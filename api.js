var models = require('./db');//数据库链接信息
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('./sqlMap');//sql语句
const wx = require('./wxconfig.json'); // 文件中存储了appid 和 secret 微信小程序设置
const request = require('request'); // 处理node request请求
var conn = mysql.createConnection(models.mysql); // 连接数据库
const jwt = require('jsonwebtoken') // 生成签名token

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
cosnole.log(1)
var json = function(obj) {
    // console.log(obj)
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
let isTokenFn = function(openId) {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM users WHERE openId='${openId}'`, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
// 增加用户登录接口
router.post('/login', (req, res) => {
    // var sql = $sql.user.add;
    var params = req.body;
    var code = '';
    if (params.code) {
        let options = {
            method: 'POST',
            url: 'https://api.weixin.qq.com/sns/jscode2session?',
            formData: {
                appid: wx.appid,
                secret: wx.secret,
                js_code: params.code,
                grant_type: 'authorization_code'
            }
        };
        request(options, (error, response, body) => {
            if(error) { // 请求异常时，返回错误信息
                res.json({
                    "status": "error",
                    "code": "ChasenKaso原创文章，转载请注明出处"
                })
            } else {
                let data = JSON.parse(body) // 返回值的字符串转JSON
                let content = {
                    openid: data.openid
                }
                let token = jwt.sign(content, 'secret', {
                    expiresIn: 60*60*1  // 1小时过期
                })
                if (token) {
                    isTokenFn(data.openid).then((result) => {
                        if (result.length < 1) {
                            conn.query(`INSERT INTO users(openId,token) VALUES ('${content.openid}', '${token}')`,function(err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                if (result) {
                                    json({res: res, data: '', msg: '登录成功', code: 1, result: true});
                                    res.end('is over');
                                } else {
                                    json({res: res, data: '', msg: '登录失败', code: 0, result: false});
                                }
                            })
                        } else {
                            conn.query(`UPDATE users SET token = '${token}' WHERE openId = '${data.openid}' `,function(err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                if (result) {
                                    json({res: res, data: '', msg: '更新成功', code: 1, result: true});
                                    res.end('is over');
                                }
                            })
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            }
        });
    } else {
        json({res: res, data: '', msg: '获取code失败', code: 0, result: false});
        next()
    }
})
router.post('/getDissSelect', (req, res) => {
    var sql = $sql.disclose.disclose
    var params = req.body
    conn.query(sql, function(err, result) { 
        if (err) {
            console.log(err);
        }
        if (result) {
            json({res: res, data: result, msg: '', code: 1, result: true});
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
        if (result) {
            json({res: res, data: result, msg: '', code: 1, result: true});
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
    conn.query(sql2, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length < 1) {
            conn.query(sql, [params.name,params.number,params.region,params.isGoOut,params.hopeGoOut,params.existence,params.diss,params.talk,params.star], function(err, result) { 
                if (err) {
                    console.log(err);
                }
                if (result) {
                    json({res: res, data: result, msg: '收到了,老板', code: 1, result: true});
                    res.end('is over');
                }
            })
        } else {
            json({res: res, data: '', msg: '我要被你点爆了', code: 1, result: false});
        }
    })
})

// 点赞接口
router.post('/addStar', (req, res) => {
    var params = req.body;
    var sql = `UPDATE company SET star = ${params.star} WHERE id = ${params.id}`
    // console.log(params)
    conn.query(sql, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            json({res: res, data: result, msg: '收到了,老板', code: 1, result: true});
            res.end('is over');
        }
    })
})
module.exports = router