"use strict";

var restify = require('restify');
var fullCors = require("./plugins/fullCors.js");

function create(options){
	var serverOptions = {
		name : options.server.name,
		serverPort: options.server.port
	};
	var server = restify.createServer(serverOptions);

	var fullCorsHeaders = fullCors(options.cors);
	function unknownMethodHandler(req, res) {
		fullCorsHeaders(req,res, function(){
			if (req.method.toLowerCase() !== 'options') {
				return res.send(new restify.MethodNotAllowedError());
			}
			return res.send(204);
		});
	}
	server.on('MethodNotAllowed', unknownMethodHandler);

	server.use(contentHeaders);

	function start (callback) {
		server.listen(serverOptions.serverPort, callback);
	}

	function shutdown (callback) {
		server.close(callback);
	}
	return {
		start : start,
		shutdown : shutdown,
		use : server.use,
		get : server.get,
		post: server.post,
		put : server.put,
		del : server.del
	};
}
exports.create=create;