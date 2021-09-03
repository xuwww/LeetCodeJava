const { TextDecoder } = require('util');

exports.decodeGBK = function(string){
    return new TextDecoder("GBK").decode(Buffer.from(string));
}