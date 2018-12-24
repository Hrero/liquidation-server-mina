// node 后端服务器

const userApi = require('./api');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
//let http = require("http");
let https = require("https");

//const port = 8088;

//const hostname = '127.0.0.1';
const httpsOption = {
    key : fs.readFileSync("./1100473_www.haozengrun.com.key"),
    cert: fs.readFileSync("./1100473_www.haozengrun.com.pem")
}
// 本地调试的时候开启
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//服务开启后访问指定编译好的dist文件下的数据
// app.use(express.static(path.resolve(__dirname, './dist')))
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
//     res.send(html)
// })
// 后端api路由
app.use('/api', userApi); 

// 监听端口 本地时候开启
app.listen(8088)
//https.createServer(httpsOption ,(req, res) => {	
//res.statusCode = 200;
  
//res.setHeader('Content-Type', 'text/plain');
//res.end('asda')
//}).listen(port);

//http.createServer(app).listen(80);
//https.createServer(httpsOption, app).listen(8088);
