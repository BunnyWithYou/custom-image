const images = require('images');
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const path = require('path');
const ejs = require('ejs');

const {
    handleImg
} = require('./handleImg');

const SERVER_CONFIG = {
    'basePath': 'images', //存放图片的目录
    'port': 4000, //端口
    'host': 'localhost'
}

let server = http.createServer((req, res) => {
    init(req, res)
})

server.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
    console.log(`GetImage Server Running at http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`)
})


let extNameList = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
}

function init(req, res) {
    let urlObj = url.parse(req.url, true)
    if (urlObj.pathname === '/favicon.ico') {
        return;
    }
    console.log(urlObj);
    let imgExtname = path.extname(urlObj.pathname);
    if (path.extname(req.url) === '') {
        res.writeHead(200, {
            'Content-Type': 'text/html;charset=utf-8'
        });
        let fullPath = path.join(__dirname, SERVER_CONFIG.basePath, urlObj.pathname)
        if(!fs.existsSync(fullPath)){
          res.write('<head><meta charset="utf-8"/></head>');
          res.end('找不到目录')
          return;
        }
        let imgList = fs.readdirSync(fullPath);
        console.log(imgList);
        for (let i = 0; i < imgList.length; i++) {
            imgList[i] = {
                showUrl:'http://' + SERVER_CONFIG.host + ':' + SERVER_CONFIG.port + '/' + imgList[i] + '?w=200',
                fullUrl: 'http://' + SERVER_CONFIG.host + ':' + SERVER_CONFIG.port + '/' + imgList[i]
            }
        }
        let str = fs.readFileSync('./public/index.ejs', 'utf-8');
        let html = ejs.render(str, {
            list: imgList,
            filename: __dirname
        })
        res.end(html);
    } else {
        let params = urlObj.query;
        fs.readFile(path.join(__dirname, SERVER_CONFIG.basePath, urlObj.pathname), function (err, myImage) {
            if (!err) {
                let newImage;
                let bufImage = new Buffer(myImage);
                let imageOption = {
                    w: Number(params.w),
                    h: Number(params.h),
                    o: Number(params.o) || 100,
                }
                newImage = handleImg(bufImage, imageOption.w, imageOption.h, imageOption.o, imgExtname)
                res.writeHead(200, {
                    'Content-Type': extNameList[imgExtname] + ';charset=utf-8'
                });
                res.end(newImage);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html;charset=utf-8'
                });
                res.write('<head><meta charset="utf-8"/></head>');
                res.end('找不到文件')
            }
        });
    }
}