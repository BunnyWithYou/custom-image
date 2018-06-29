const images = require('images');
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');

const SERVER_CONFIG = {
    'port': 4000
}

let server = http.createServer((req, res) => {
    init(req, res)
})

server.listen(SERVER_CONFIG.port, () => {
    console.log(`GetImage Server Running at http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`)
})

function init(req, res) {
    if (url.parse(req.url).pathname === '/favicon.ico') {
        return;
    }
    res.writeHead(200, {
        'Content-Type': 'image/jpeg;charset=utf-8'
    });
    if (path.extname(req.url) === '') {
        res.write('<head><meta charset="utf-8"/></head>');
        res.end('请输入文件名')
    } else {
        let params = url.parse(req.url, true).query
        fs.readFile(__dirname + url.parse(req.url).pathname, function (err, myImage) {
            let newImage;
            let buImage = new Buffer(myImage);
            if (params.w && params.h) {
                newImage = images(buImage).resize(Number(params.w), Number(params.h)).encode('jpg');
            } else if (params.w) {
                newImage = images(buImage).resize(Number(params.w)).encode('jpg');
            } else if (params.h) {
                newImage = images(buImage).resize(null,Number(params.h)).encode('jpg');
            } else {
                newImage = buImage
            }
            res.end(newImage);
        });

    }
}