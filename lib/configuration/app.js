var nconf = require('nconf');

function config() {
	nconf.argv().env();
	/* 
	 * There are two environments for the time being, development and default.
	 * By default, Production environment 
	*/
	var environment = nconf.get('NODE_ENV');
	if(environment === 'development') {
		nconf.file(environment, './config/' + environment.toLowerCase() + '.json');
	} else {
		nconf.file('default', './config/production.json');
	}
}

config.prototype.get = function(key) {
	return nconf.get(key);
};

module.exports = new config();