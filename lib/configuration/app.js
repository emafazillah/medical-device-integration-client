var nconf = require('nconf');

function config() {
	nconf.argv().env();
	/*
	console.log('env===' + nconf.get('NODE_ENV'));
	var environment = nconf.get('NODE_ENV') || 'development';
	nconf.file(environment, './config/' + environment.toLowerCase() + '.json');
	nconf.file('default', './config/default.json');
	*/
	/* 
	 * There are two environments for the time being, development and default.
	 * Production environment to be added soon 
	*/
	var environment = nconf.get('NODE_ENV');
	if(environment === 'development') {
		nconf.file(environment, './config/' + environment.toLowerCase() + '.json');
	} else {
		nconf.file('default', './config/default.json');
	}
}

config.prototype.get = function(key) {
	return nconf.get(key);
};

module.exports = new config();