"use strict";

var crypto = require("crypto");

function contentHeaders (req, res, next){
	res.once("header",function(){
		res.removeHeader("transfer-encoding");
		if(res._data){
			var hash = crypto.createHash('md5');
			hash.update(res._data);
			res.setHeader("Content-Type","application/json");
            res.setHeader('Content-MD5', hash.digest('base64'));
			res.setHeader('Content-Length', Buffer.byteLength(res._data));
		}else{
			res.removeHeader("Content-Type");
            res.removeHeader('Content-MD5');
			res.removeHeader('Content-Length');
		}
	});
	return next();
};

module.exports = contentHeaders;