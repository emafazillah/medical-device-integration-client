var envVars = {
  apiUrl: process.env.API_URL
};

module.exports = {
	development: {
		ENV_VARS: envVars
	},
	production: {
		ENV_VARS: envVars
	}
};