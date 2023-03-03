'use strict';

const { getPluginService } = require('./utils/getPluginService');
const { setupCronWebhook } = require('./utils/setupCronWebhook');
const { setupEventWebhook } = require('./utils/setupEventWebhook');
const { setupCronCheckVercelStates } = require('./utils/setupCronCheckVercelStates');

module.exports = async ({ strapi }) => {
	const settings = getPluginService(strapi, 'settingsService').get();

	// setup cron for check Vercel
	setupCronCheckVercelStates(strapi, settings);

	// complete any required webhook setup
	if (settings.trigger.type === 'cron') {
		setupCronWebhook(strapi, settings);
		strapi.log.info('[vercel website builder] cron webhook trigger enabled');
	} else if (settings.trigger.type === 'event') {
		setupEventWebhook(strapi, settings);
		strapi.log.info('[vercel website builder] event webhook trigger enabled');
	} else {
		strapi.log.info('[vercel website builder] manual webhook trigger enabled');
	}
};
