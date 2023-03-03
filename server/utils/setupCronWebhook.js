const { getPluginService } = require('./getPluginService');

/**
 * Setup function for cron type trigger
 *
 */
const setupCronWebhook = (strapi, settings) => {
	strapi.cron.add({
		[settings.trigger.cron]: ({ strapi }) => {
			getPluginService(strapi, 'buildService').build({ settings, trigger: { type: 'cron' } });
		},
	});
};

const setupCronVercelStates = (strapi, settings) => {
	if(settings.vercel.cron === 'undefined') {
		settings.vercel.cron = '*/1 * * * *';
	}

	strapi.cron.add({
		[settings.vercel.cron]: ({ strapi }) => {
			getPluginService(strapi, 'vercelService').checkStates({ settings });
		},
	});
};

module.exports = {
	setupCronWebhook,
	setupCronVercelStates
};
