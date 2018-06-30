const images = require('images');
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');

const SERVER_CONFIG = {
    'basePath': '/images', //存放图片的目录
    'port': 4000 //端口
}

let server = http.createServer((req, res) => {
    init(req, res)
})

server.listen(SERVER_CONFIG.port, () => {
    console.log(`GetImage Server Running at http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`)
})


let imgNameList = {
    'jpeg':'image/jpeg',
    'jpg':'image/jpeg',
    'png':'image/png'
}

function init(req, res) {
    let urlObj = url.parse(req.url, true)
    if (urlObj.pathname === '/favicon.ico') {
        return;
    }
    res.writeHead(200, {
        'Content-Type': 'image/jpeg;charset=utf-8'
    });
    if (path.extname(req.url) === '') {
        res.write('<head><meta charset="utf-8"/></head>');
        res.end('请输入文件名')
    } else {
        let params = urlObj.query;
        fs.readFile(__dirname + SERVER_CONFIG.basePath + urlObj.pathname, function (err, myImage) {
            let newImage;
            let bufImage = new Buffer(myImage);
            let imageOption = {
                w: Number(params.w),
                h: Number(params.h),
                o: Number(params.o) || 100,
            }
            if (imageOption.w && imageOption.h) {
                newImage = images(bufImage).resize(Number(imageOption.w), Number(imageOption.h)).encode('jpg', {
                    operation: imageOption.o
                });
            } else if (imageOption.w) {
                newImage = images(bufImage).resize(Number(imageOption.w)).encode('jpg', {
                    operation: imageOption.o
                });
            } else if (imageOption.h) {
                newImage = images(bufImage).resize(null, Number(params.h)).encode('jpg', {
                    operation: imageOption.o
                });
            } else {
                newImage = bufImage
            }
            res.end(newImage);
        });
    }
}