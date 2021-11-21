'use strict';

/**
 * publish.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const got = require('got');
module.exports = {
	/**
	 * Makes a request to the url specified in the plugin config
	 *
	 * @param {object} settings The configuration settings for the plugin
	 *
	 * @return {Promise<object>} response The response data from the url
	 */
	index: (settings) => {
		const { url, headers } = settings;
		const options = {
			responseType: 'json',
		};

		if (headers) {
			options.headers = headers;
		}

		return got(url, options);
	},
};