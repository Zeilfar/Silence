"use strict";

var restify = require('restify');
var fullCors = require("./plugins/fullCors.js");
var contentHeaders = require("./plugins/contentHeaders.js");

function create(options){
	var serverOptions = {
		name : options.server.name,
		serverPort: options.server.port
	};
	var server = restify.createServer(serverOptions);

	var fullCorsHeaders = fullCors(options.cors);
	server.use(fullCorsHeaders);
	
	function unknownMethodHandler(req, res) {
		fullCorsHeaders(req,res, function(){
			if (req.method.toLowerCase() !== 'options') {
				return res.send(new restify.MethodNotAllowedError());
			}
			return res.send(204);
		});
	}
	server.on('MethodNotAllowed', unknownMethodHandler);

	server.use(restify.bodyParser());
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
		use : server.use.bind(server),
		get : server.get.bind(server),
		post: server.post.bind(server),
		put : server.put.bind(server),
		del : server.del.bind(server)
	};
}
exports.create=create;