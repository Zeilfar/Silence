"use strict";

var restify = require('restify');

function create(options){
	var serverOptions = {
		name : options.server.name,
		serverPort: options.server.port
	};
	var server = restify.createServer(serverOptions);

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