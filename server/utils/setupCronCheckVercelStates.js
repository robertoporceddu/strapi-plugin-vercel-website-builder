const { getPluginService } = require('./getPluginService');

/**
 * Setup function for cron check Vercel States
 *
 */
const setupCronCheckVercelStates = (strapi, settings) => {
	if(settings.vercel.cron === undefined) {
		settings.vercel.cron = '*/1 * * * *';
	}

	strapi.log.info('[vercel website builder] cron check vercel states enabled');

	strapi.cron.add({
		[settings.vercel.cron]: ({ strapi }) => {
			getPluginService(strapi, 'vercelService').checkStates({ settings });
		},
	});
};

module.exports = {
	setupCronCheckVercelStates
};
