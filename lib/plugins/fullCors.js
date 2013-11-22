"use strict";

function getAllowedOrigin(headerOrigin, allowedOrigins){
	for(var i=0;i<allowedOrigins; i++){
		if (headerOrigin === allowedOrigins[i] && allowedOrigins[i] !== '*') {
			return headerOrigin;
		}
	}
	return allowedOrigins.indexOf("*")=== -1 ?  null : '*';
}

function fullCorsResponse(options) {
		var allowedOrigins = options.allowedOrigins;

		var exposedHeaders = (options.exposedHeaders).slice(0);
		var allowedHeaders = (options.allowedHeaders).slice(0);
 	
		function fullResponseHeaders(req, res, next) {
		 	var allowedOrigin = getAllowedOrigin(req.headers['origin'], allowedOrigins);

			if (!allowedOrigin) {
				console.log("Origin not allowed:",req.headers['origin']);
				//ORIGIN NOT ALLOWED !
				return next();
			}

			res.once('header', function () {
				var now = new Date();
				res.setHeader('Date',now.toUTCString());
				res.setHeader('Connection',  req.isKeepAlive() ? 'Keep-Alive' : 'close');
				res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));
				res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(',' ));
				res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
				//TODO how can I have false for this condition?
				if (res.methods && res.methods.length > 0) {
					if (res.methods.indexOf('OPTIONS') === -1){
						res.methods.push('OPTIONS');
					}
					res.setHeader('Allow', res.methods.join(', '));
					res.setHeader('Access-Control-Allow-Methods', res.methods.join(', '));
				}
			});

			return next();
		}

		return fullResponseHeaders;
}

///--- Exports

module.exports = fullCorsResponse;
