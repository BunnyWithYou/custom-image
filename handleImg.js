const images = require('images');
/**
 * 
 * @param {Buffer} buffImg 图片的buff格式
 * @param {Number} w 需要设置图片的宽度
 * @param {Number} h 需要设置图片的高度
 * @param {Number} o 需要设置图片的压缩比率(max 100)
 * @param {String} extname 图片的后缀名
 */
module.exports.handleImg = function (buffImg, w, h, o, extname) {
    let img = images(buffImg);
    if (w && h) {
        img = img.resize(w, h);
    } else if (w) {
        img = img.resize(w);
    } else if (h) {
        img = img.resize(null, h)
    }
    if (o && extname == '.jpeg' || extname == '.jpg') {
        img = img.encode('jpg', {
            operation: o
        });
    } else {
        img = img.encode(extname.substring(1), {
            operation: o
        });
    }
    return img;
}